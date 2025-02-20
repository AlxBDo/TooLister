import { extendedState } from "~/plugins/pinia/extendsStore/extendedState"
import { useCollectionStore, type CollectionStoreMethods } from "./collection"
import type { Liste } from "~/models/liste"
import type { IExtendedState, IExtendedStore, IItemListState, TExtendedStore } from "~/types/store"

const defaultStoreId: string = 'lists'

type ListsStore = () => TExtendedStore<CollectionStoreMethods, IItemListState<Liste>>


export const useListsStore: TExtendedStore<Partial<CollectionStoreMethods>, Partial<IItemListState<Liste>>> = (id?: string) => defineStore(id ?? defaultStoreId, {
    state: (): IExtendedState => ({
        ...extendedState(
            [useCollectionStore('listsCollection')]
        )
    }),

    actions: {
        init() {
            if (typeof this?.isExtended === 'object') {
                this.isExtended = false
            }
        }
    }
})()