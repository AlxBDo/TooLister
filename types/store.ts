import type { FetchAllData } from "~/models/api";
import type { ISearchParamObject } from ".";
import type { Item } from "~/models/item";
import type { View } from "~~/types/view";


export interface IItemListActions {
    addItem: <T extends Item>(item: T) => void,
    deleteItem: <T extends Item>(deletedItem: T) => void,
    setData: <T>(data: FetchAllData<T>) => void,
    setError: (error?: string) => void,
    getItem: <T>(criteria: ISearchParamObject) => T,
    getItems: <T>(criteria?: ISearchParamObject) => T[],
    setItems: <T>(items: T[]) => void,
    setLoading: (isLoading: boolean) => void,
    updateItem: <T extends Item>(updatedItem: T) => void
}

export interface IItemListState<T> {
    items: T[];
    hubUrl?: URL;
    isLoading: boolean;
    view?: View;
    error?: string;
}

export interface IPersistedState {
    isEncrypted?: boolean;
    persist: boolean;
    persistedPropertiesToEncrypt?: string[];
}