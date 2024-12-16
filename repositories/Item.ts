import type { FetchAllData } from "~/models/api";
import type { Item } from "~/models/item";
import type { IItem, ISearchCriteria, IStringObject } from "~/types";


export default class ItemRepository {

    async deleteItem<T extends Item>(item: T) {
        return await useDeleteItem(item);
    }

    async getItemById<T extends Item>(id: number | string, ressource: string) {
        return await useFetchItem<T>(`${ressource}/${id}`);
    }

    async getItems<T extends Item>(
        ressource: string,
        params?: ISearchCriteria & Partial<T>) {
        return await useFetchList<T>(ressource, params)
    }

    async insertItem<T extends Item>(item: T, ressource: string) {
        const data = await useCreateItem<T>(
            ressource,
            item
        );
        if (data.created) {
            return data.created
        }
    }

    async updateItem<T extends Item>(newItem: T, oldItem: T) {
        if (!oldItem.id) {
            return;
        }

        const data = await useUpdateItem<T>(oldItem, newItem);

        if (data.updated) {
            return data.updated
        }
    }

}