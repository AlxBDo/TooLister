import type { GiftItem } from "~/models/giftitem";
import type { ListItem } from "~/models/listitem";
import type { ShoppingItem } from "~/models/shoppingitem";
import type { TaskItem } from "~/models/taskitem";
import type { TList, TListTypes } from "~/types/list";

import CategoryManager from "./Category";
import ListItemRepository from "~/repositories/ListItem";
import { TYPE_GIFT } from "~/models/liste";
import { useListeStore } from "~/stores/liste";
import { useListeListStore } from "~/stores/liste/list";


export type TListItem = GiftItem | ListItem | ShoppingItem | TaskItem;


export default class ListItemFormManager {

    static save(listType: TListTypes, newListItem: TListItem, oldListItem?: TListItem) {
        const data = this.submiDataFormater(newListItem, listType)

        return oldListItem?.id
            ? ListItemRepository.update(data, oldListItem)
            : ListItemRepository.insert(data, listType)
    }

    static submiDataFormater(item: TListItem, listType: TListTypes): TListItem {
        const integerProperties = ['durationType', 'priority']

        integerProperties.forEach(property => {
            if (item[property]) {
                item[property] = parseInt(item[property])
            }
        })

        if (listType === TYPE_GIFT) {
            if (item.buyers) { delete item.buyers }
        }

        if (!item.category) {
            item.category = undefined
        } else if (typeof item.category === 'number') {
            item.category = `/apip/categories/${item.category}`
        } else if (typeof item.category === 'string') {
            item.category = CategoryManager.populateCategory({ name: item.category, listType })
        }

        return item
    }

    static updateStore(list: TList, listItem: TListItem) {
        const listStore = useListeStore()
        listStore.setData(list)

        if (listItem.category) {
            if (typeof listItem.category === 'string') {
                listItem.category = CategoryManager.populateCategory({ '@id': listItem.category })
            } else if (typeof listItem.category === 'object' && (!listItem.category.id || !listItem.category.name)) {
                listItem.category = { ...CategoryManager.populateCategory(listItem.category), ...listItem.category }
            }
        }

        let items = [] as TListItem[]
        if (list.selectedItems) { items = list.selectedItems }
        if (list.unselectedItems) { items = [...items, list.unselectedItems] }

        if (items.find((i: TListItem) => i['@id'] === listItem['@id'])) {
            listStore.updateItems(listItem)
        } else {
            listStore.addItem(listItem)
        }

        const listListStore = useListeListStore()
        listListStore.saveList(listStore.$state)
    }

}