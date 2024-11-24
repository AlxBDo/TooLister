import ItemRepository from "./Item";
import listFactory from "~/factories/List";
import ListManager from "~/managers/List";
import type { Liste } from "~/models/liste";


class ListRepository extends ItemRepository {

    private _ressource: string = 'listes'

    async insert(list: Liste) {
        return await this.insertItem<Liste>(listFactory.create(list) as Liste, this._ressource)
    }

    async update(newList: Liste, oldList: Liste) {
        return await this.updateItem<Liste>(newList, oldList)
    }

}

export default new ListRepository();