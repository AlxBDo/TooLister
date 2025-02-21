import type { FetchAllData } from "~/models/api";
import type { IAnyObject, ISearchParamObject } from ".";
import type { Item } from "~/models/item";
import type { View } from "~~/types/view";
import type ItemRepository from "~/repositories/Item";
import type { _StoreWithGetters, PiniaCustomProperties, PiniaCustomStateProperties, StateTree, Store, StoreGeneric, StoreGetters, SubscriptionCallback } from "pinia";
import type { IPersistOptions } from "~/plugins/pinia/extendsStore/extendedState";
import type { ToRefs } from "vue";


export type AugmentStore<T> = Store & T

export type AugmentOptionApiStore<TStore, TState> = Store & TStore & TState & TOptionApiStore<TState> & PiniaCustomProperties & PiniaCustomStateProperties & _StoreWithGetters<TState>

type TOptionApiStore<TState> = {
    $patch: (item: Partial<TState>) => void
    $reset: () => void
    $state: TState
    $subscribe: (callback: SubscriptionCallback<TState>) => void
}


/**
 * - -- | ItemList Store | -- -
 */

export interface IItemListActions {
    addItem: <T extends Item>(item: T) => void,
    deleteItem: <T extends Item>(deletedItem: T) => void,
    setData: <T>(data: FetchAllData<T>) => void,
    setError: (error?: string) => void,
    getItem: <T extends IAnyObject>(criteria: ISearchParamObject & Partial<T>) => T | undefined,
    getItems: <T extends Item>(criteria?: ISearchParamObject & Partial<T>) => T[],
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

export interface IExtendedStore extends PiniaCustomProperties {
    init: () => void
}

export type TExtendedState<T, I> = T & I & IExtendedState

export type TExtendedStore<TStore, TState> = (args?: any) => Store & TStore & TState & PiniaCustomProperties

export type TExtendedStoreOptionApi<TStore, TState> = (args?: any) => Store & TStore & TState & PiniaCustomProperties & TOptionApiStore<TState>

export type TStoreExtended<TStore, TState> = Store & TStore & TState & PiniaCustomProperties