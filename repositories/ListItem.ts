import ItemRepository from "./Item";
import ListItemFactory from "~/factories/ListItem";
import ListItemManager from "~/managers/ListItem";
import type { TListItem } from "~/managers/ListItemForm";
import type { TListTypes } from "~/types/list";


class ListItemRepository extends ItemRepository {

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