import { extendedState } from "~/plugins/pinia/extendsStore/extendedState";
import { useItemStore, type IItemStoreState } from "./item";
import type { IExtendedState } from "~/types/store";
import type { Liste } from "~/models/liste";
import type { ListItem } from "~/models/listitem";


interface IListStoreState extends IItemStoreState, IExtendedState, Liste {

}

type TListItemStoreState = IItemStoreState & IExtendedState & ListItem

export const useListItemStore = (id: string | number) => defineStore(`listItem-${id}`, {
    state: (): TListItemStoreState => ({
        ...extendedState(
            [useItemStore(`list-item-${id}`)]
        ),
        category: undefined,
        description: undefined,
        list: undefined,
        name: undefined,
        status: undefined,
        url: undefined
    }),

    actions: {
        setData(data: ListItem) {
            if (data.category) {
                // TODO: créer category store
                this.category = data.category
            }

            if (data.description) { this.description = data.description }

            if (data.list) { this.list = data.list }

            if (data.status) { this.status = data.status }

            if (data.url) { this.url = data.url }
        }
    }
})