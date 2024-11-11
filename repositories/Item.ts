import type { Item } from "~/models/item";


export default abstract class ItemRepository {

    protected async insertItem<T extends Item>(item: T, ressource: string) {
        const data = await useCreateItem<T>(
            ressource,
            item
        );
        if (data.created) {
            return data.created
        }
    }

    protected async updateItem<T extends Item>(newItem: T, oldItem: T) {
        if (!oldItem.id) {
            return;
        }

        const data = await useUpdateItem<T>(oldItem, newItem);

        if (data.updated) {
            return data.updated
        }
    }

}