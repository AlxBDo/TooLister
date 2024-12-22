import type { Pinia, PiniaPluginContext } from "pinia"
import type { FetchAllData } from "~/models/api";
import type { Item } from "~/models/item";
import ItemRepository from "~/repositories/Item";
import type { IAnyObject, ISearchParamObject } from "~/types";
import type { IItemListActions } from "~/types/store";
import type { View } from "~/types/view";
import { arrayObjectFindAllBy, arrayObjectFindBy } from "~/utils/object";
import { itemsAreEmpty } from "~/utils/validation/store";

type TItemListActionsName = keyof IItemListActions

function itemListStorePlugin({ store }: PiniaPluginContext) {
    if (store.$id.substring(store.$id.length - 4) === 'List') {
        if (store.$state.persist) {
            if (!store.$state.excludedKeys || !Array.isArray(store.$state.excludedKeys)) {
                store.$state.excludedKeys = []
            }

            const persistedListExcludedKeys = [
                'error',
                'hubUrl',
                'isEncrypted',
                'isLoading',
                'persist',
                'persistedPropertiesToEncrypt',
                'rewritedActions'
            ]

            store.$state.excludedKeys = [...store.$state.excludedKeys, ...persistedListExcludedKeys]
        }

        if (!store.$state.rewritedActions) {
            store.$state.rewritedActions = [] as TItemListActionsName[]
        }

        if (!store.$state.rewritedActions.includes('addItem')) {
            store.addItem = <T>(item: T): void => {
                store.$state.items.push(item);
            }
        }

        if (!store.$state.rewritedActions.includes('getItem')) {
            store.getItem = <T extends IAnyObject>(criteria: ISearchParamObject & T): T | undefined => {
                return arrayObjectFindBy<T>(store.$state.items, criteria);
            }
        }

        if (!store.$state.rewritedActions.includes('getItems')) {
            store.getItems = <T extends IAnyObject>(criteria: ISearchParamObject & T): T[] => {
                return arrayObjectFindAllBy<T>(store.$state.items, criteria);
            }
        }

        if (!store.$state.rewritedActions.includes('deleteItem')) {
            store.deleteItem = <T extends Item>(deletedItem: T) => {
                store.$state.items = store.$state.items.filter((item: T) => {
                    return item["@id"] !== deletedItem["@id"];
                });

                const repository = new ItemRepository()
                repository.deleteItem<T>(deletedItem)
            }
        }

        if (!store.$state.rewritedActions.includes('setData')) {
            store.setData = <T>({ items, isLoading, error, hubUrl }: FetchAllData<T>) => {
                store.setItems(items.value);
                store.setLoading(isLoading.value);
                if (hubUrl) store.setHubUrl(hubUrl.value);

                if (error.value instanceof Error) {
                    store.setError(error.value?.message);
                }
            }
        }

        if (!store.$state.rewritedActions.includes('setError')) {
            store.setError = (error?: string) => {
                store.$state.error = error;
            }
        }

        if (!store.$state.rewritedActions.includes('setHubUrl')) {
            store.setHubUrl = (hubUrl?: URL) => {
                store.$state.hubUrl = hubUrl;
            }
        }

        if (!store.$state.rewritedActions.includes('setItems')) {
            store.setItems = <T>(items: T[]) => {
                store.$state.items = items;
            }
        }

        if (!store.$state.rewritedActions.includes('setLoading')) {
            store.setLoading = (isLoading: boolean) => {
                store.$state.isLoading = isLoading;
            }
        }

        if (!store.$state.rewritedActions.includes('setView')) {
            store.setView = (view?: View) => {
                store.$state.view = view;
            }
        }

        if (store.$state.persist && !store.$state.rewritedActions.includes('stateIsEmpty')) {
            store.stateIsEmpty = itemsAreEmpty
        }

        if (!store.$state.rewritedActions.includes('updateItem')) {
            store.updateItem = <T extends Item>(updatedItem: T, persist: boolean = true) => {
                const item: T | undefined = store.$state.items.find(
                    (i: T) => i["@id"] === updatedItem["@id"]
                );

                if (!item) {
                    store.$state.items.push(updatedItem)
                    return
                }

                if (persist) {
                    const repository = new ItemRepository()
                    repository.updateItem<T>(updatedItem, item)
                }

                Object.assign(item, updatedItem);
            }
        }
    }
}

export default defineNuxtPlugin({
    name: 'itemListStore',
    async setup({ $pinia }) {
        ($pinia as Pinia).use(itemListStorePlugin)
    }
})