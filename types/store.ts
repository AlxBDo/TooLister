import type { StateTree } from "pinia";
import type { View } from "~~/types/view";

export interface IItemListState<T> {
    items: T[];
    hubUrl?: URL;
    isLoading: boolean;
    view?: View;
    error?: string;
}

export interface IPersistedState {
    persist: boolean;
    persistedPropertiesToEncrypt?: string[];
    stateIsEmpty?: (state: StateTree) => boolean;
}