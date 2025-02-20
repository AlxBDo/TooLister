import { extendedState } from "~/plugins/pinia/extendsStore/extendedState";
import { useItemStore, type IItemStoreState } from "./item";
import type { IExtendedState } from "~/types/store";
import type { Liste } from "~/models/liste";
import { useCollectionStore } from "./collection";
import type { PiniaCustomProperties } from "pinia";


export type TListStoreState = IItemStoreState & IExtendedState & Liste

export const useListStore = (id: string | number) => defineStore(`list-${id}`, {
    state: (): TListStoreState => ({
        ...extendedState(
            [useItemStore(`list-item-${id}`), useCollectionStore(`list-${id}-items`)]
        ),
        guest: [],
        usersRole: [],
        owner: undefined,
        selectedItems: [],
        type: undefined,
        unselectedItems: []
    }),
})