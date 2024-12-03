import ItemRepository from "./Item";
import listFactory from "~/factories/List";
import ListManager from "~/managers/List";
import type { FetchItemData } from "~/models/api";
import type { Item } from "~/models/item";
import type { Liste } from "~/models/liste";


class ListRepository extends ItemRepository {

    private _ressource: string = 'listes'

    async getById<T extends Item>(id: number | string): Promise<FetchItemData<T>> {
        return await this.getItemById(id, this._ressource)
    }

    async insert(list: Liste) {
        return await this.insertItem<Liste>(listFactory.create(list) as Liste, this._ressource)
    }

    async update(newList: Liste, oldList: Liste) {
        return await this.updateItem<Liste>(newList, oldList)
    }

}

export default new ListRepository();