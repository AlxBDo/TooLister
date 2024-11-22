import type { Item } from "~/models/item";
import type { IStringObject } from "~/types";


export default class ItemRepository {

    protected async deleteItem<T extends Item>(item: T) {
        return await useDeleteItem(item);
    }

    protected async getItemById<T extends Item>(id: number | string, ressource: string) {
        return await useFetchItem<T>(`${ressource}/${id}`);
    }

    protected async getItems<T extends Item>(ressource: string, params?: IStringObject) {
        if (params) {
            ressource += `?${this.transformSearchObjectToUrlParams(params)}`
        }

        return await useFetchList<T>(ressource)
    }

    protected async insertItem<T extends Item>(item: T, ressource: string) {
        const data = await useCreateItem<T>(
            ressource,
            item
        );
        if (data.created) {
            return data.created
        }
    }

    /**
     * 
     * @param params 
     * @returns 
     */
    transformSearchObjectToUrlParams(params: IStringObject): string {
        return Object.keys(params).reduce((acc: string[], curr: string) => {
            if (params[curr]) {
                acc.push(`${curr}=${params[curr]}`)
            }
            return acc
        }, []).join('&')
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