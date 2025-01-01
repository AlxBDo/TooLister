import ItemRepository from "./Item";
import listFactory from "~/factories/List";
import type { FetchItemData } from "~/models/api";
import type { Item } from "~/models/item";
import type { Liste } from "~/models/liste";
import type { ListUserRole } from "~/models/listUserRole";
import type { ISearchCriteria } from "~/types";

export interface IListSearchCriteria extends ISearchCriteria, Omit<Liste, 'usersRole'> {
    usersRole?: Partial<ListUserRole>
}


class ListRepository extends ItemRepository {

    private _ressource: string = 'listes'

    private formatList(list: Liste): Liste {
        if (list.selectedItems) {
            delete list.selectedItems
        }

        return list
    }

    async getListById<T extends Item>(id: number | string): Promise<FetchItemData<T>> {
        return await this.getItemById(id, this._ressource)
    }

    async getLists(searchCriteria: IListSearchCriteria) {
        return await this.getItems(this._ressource, searchCriteria)
    }

    async insert(list: Liste) {
        return await this.insertItem<Liste>(listFactory.create(list) as Liste, this._ressource)
    }

    async update(newList: Liste, oldList: Liste) {
        return await this.updateItem<Liste>(this.formatList(newList), oldList)
    }

}

export default new ListRepository();