import ListItemManager from "~/managers/ListItem";
import type { TListItem } from "~/managers/ListItemForm";
import type { TListTypes } from "~/managers/List";
import ItemRepository from "./Item";


class ListItemRepository extends ItemRepository {

    async insert(listItem: TListItem, listType: TListTypes) {
        return await this.insertItem<TListItem>(
            ListItemManager.create(listItem, listType),
            ListItemManager.getItemRessource(listType)
        )

        const data = await useCreateItem<TListItem>(
            ListItemManager.getItemRessource(listType),
            ListItemManager.create(listItem, listType)
        );
        if (data.created) {
            return data.created
        }
    }

    async update(newListItem: TListItem, oldListItem: TListItem) {
        return await this.updateItem<TListItem>(newListItem, oldListItem)

        if (!oldListItem.id) {
            return;
        }

        const data = await useUpdateItem<TListItem>(oldListItem, newListItem);

        if (data.updated) {
            return data.updated
        }
    }

}

export default new ListItemRepository();