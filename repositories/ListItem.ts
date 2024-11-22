import ListItemManager from "~/managers/ListItem";
import type { TListItem } from "~/managers/ListItemForm";
import type { TListTypes } from "~/types/list";
import ItemRepository from "./Item";


class ListItemRepository extends ItemRepository {

    async insert(listItem: TListItem, listType: TListTypes) {
        return await this.insertItem<TListItem>(
            ListItemManager.create(listItem, listType),
            ListItemManager.getItemRessource(listType)
        )
    }

    async update(newListItem: TListItem, oldListItem: TListItem) {
        return await this.updateItem<TListItem>(newListItem, oldListItem)
    }

}

export default new ListItemRepository();