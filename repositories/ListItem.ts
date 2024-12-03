import ItemRepository from "./Item";
import ListItemFactory from "~/factories/ListItem";
import ListItemManager from "~/managers/ListItem";
import { LIST_TYPES } from "~/models/liste";
import type { ISearchCriterias } from "~/types";
import type { TListItem } from "~/managers/ListItemForm";
import type { TListTypes } from "~/types/list";


interface ISearchListItemCriteria extends ISearchCriterias {
    category?: string;
    listType?: TListTypes;
    status?: number;
}


class ListItemRepository extends ItemRepository {

    async getListItems(searchCriteria: ISearchListItemCriteria) {
        return await this.getItems(
            this.getRessource(searchCriteria.listType),
            searchCriteria
        )
    }

    getRessource(listType?: TListTypes): string {
        return listType ? `${LIST_TYPES[listType]}_items` : 'list_items'
    }

    async insert(listItem: TListItem, listType: TListTypes) {
        return await this.insertItem<TListItem>(
            ListItemFactory.create(listType, listItem),
            ListItemManager.getItemRessource(listType)
        )
    }

    async update(newListItem: TListItem, oldListItem: TListItem) {
        return await this.updateItem<TListItem>(newListItem, oldListItem)
    }

}

export default new ListItemRepository();