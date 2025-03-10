import type { Store } from "pinia"
import type { FetchAllData } from "~/models/api"
import type { Item } from "~/models/item"
import type { ISearchParamObject } from "~/types"
import type { IExtendedState, IItemListActions, IItemListState, IPersistedState, IPersistedStore } from "~/types/store"


export const itemListState = <T>(): IItemListState<T> => ({
    items: [] as T[],
    isLoading: false,
    error: undefined,
    hubUrl: undefined
})

export const itemState: Item = {
    '@id': undefined,
    id: undefined
}

export const persistedState = (
    persist: boolean = true,
    persistedPropertiesToEncrypt?: string[],
    excludedKeys?: string[],
    isEncrypted = false

): IPersistedState => ({
    excludedKeys,
    isEncrypted,
    persist,
    persistedPropertiesToEncrypt
})

export const fakeItemListActions: IItemListActions = {
    addItem: <T extends Item>(item: T) => false,
    deleteItem: <T extends Item>(deletedItem: T) => false,
    setData: <T>(data: FetchAllData<T>) => false,
    setError: (error?: string) => false,
    getItem: <T>(criteria: ISearchParamObject): T => ({} as T),
    getItems: <T>(criteria?: ISearchParamObject): T[] => [],
    setHubUrl: (hubUrl: URL) => false,
    setItems: <T>(items: T[]) => false,
    setLoading: (isLoading: boolean) => false,
    updateItem: <T extends Item>(updatedItem: T, persist?: boolean) => false
}

export const fakePersistActions: IPersistedStore = {
    persistState: () => undefined,
    remember: () => undefined,
    watch: () => undefined
}