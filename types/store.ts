import type { FetchAllData } from "~/models/api";
import type { ISearchParamObject } from ".";
import type { Item } from "~/models/item";
import type { View } from "~~/types/view";
import type ItemRepository from "~/repositories/Item";
import type { Store } from "pinia";
import type { IPersistOptions } from "~/plugins/pinia/extendsStore/extendedState";



/**
 * - -- | ItemList Store | -- -
 */

export interface IItemListActions {
    addItem: <T extends Item>(item: T) => void,
    deleteItem: <T extends Item>(deletedItem: T) => void,
    setData: <T>(data: FetchAllData<T>) => void,
    setError: (error?: string) => void,
    getItem: <T>(criteria: ISearchParamObject) => T,
    getItems: <T>(criteria?: ISearchParamObject) => T[],
    setHubUrl: (hubUrl: URL) => void,
    setItems: <T>(items: T[]) => void,
    setLoading: (isLoading: boolean) => void,
    updateItem: <T extends Item>(updatedItem: T, persist?: boolean) => void
}

export interface IItemListState<T> {
    items: T[];
    hubUrl?: URL;
    isLoading: boolean;
    view?: View;
    error?: string;
    repository?: ItemRepository
}


/**
 * - -- | Persit Store | -- -
 */

export interface IPersistedState {
    excludedKeys?: string[]
    isEncrypted?: boolean
    persist: boolean
    persistedPropertiesToEncrypt?: string[]
}

export interface IPersistedStore {
    persistState: () => void
    remember: () => void
    watch: () => void
}


/**
 * - -- | Extends Store | -- -
 */

export interface IExtendedState extends IPersistOptions {
    actionsToExtends?: string[] | Ref<string[] | undefined>
    isExtended?: boolean | Ref<boolean | undefined>
    isOptionApi?: boolean | Ref<boolean | undefined>
    parentsStores?: Store[] | Ref<Store[]>
}

export interface IExtendedStore {
    init: () => void
}

export type TExtendedState<T, I> = T & I & IExtendedState

export type TExtendedStore<TStore, TState> = (args?: any) => Store & TStore & TState & IExtendedStore

export type TStoreExtended<TStore, TState> = Store & TStore & TState & IExtendedStore