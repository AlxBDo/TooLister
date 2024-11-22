import type { Pinia, PiniaPluginContext } from "pinia"
import type { FetchAllData } from "~/models/api";
import type { Item } from "~/models/item";
import type { View } from "~/types/view";
import { itemsAreEmpty } from "~/utils/validation/store";

function itemListStorePlugin({ store }: PiniaPluginContext) {
    if (store.$id.substring(store.$id.length - 4) === 'List') {
        store.setData = <T>({ items, isLoading, error, hubUrl }: FetchAllData<T>) => {
            store.setItems(items.value);
            store.setLoading(isLoading.value);
            if (hubUrl) store.setHubUrl(hubUrl.value);

            if (error.value instanceof Error) {
                store.setError(error.value?.message);
            }
        }

        store.setLoading = (isLoading: boolean) => {
            store.$state.isLoading = isLoading;
        }

        store.setItems = <T>(items: T[]) => {
            store.$state.items = items;
        }

        store.setHubUrl = (hubUrl?: URL) => {
            store.$state.hubUrl = hubUrl;
        }

        store.setView = (view?: View) => {
            store.$state.view = view;
        }

        store.setError = (error?: string) => {
            store.$state.error = error;
        }

        if (store.$state.persist && !store.stateIsEmpty) {
            store.stateIsEmpty = itemsAreEmpty
        }

        store.updateItem = <T extends Item>(updatedItem: T) => {
            const item: T | undefined = store.$state.items.find(
                (i: T) => i["@id"] === updatedItem["@id"]
            );

            if (!item) {
                store.$state.items.push(updatedItem)
                return
            }

            Object.assign(item, updatedItem);
        }

        store.deleteItem = <T extends Item>(deletedItem: T) => {
            store.$state.items = store.$state.items.filter((item: T) => {
                return item["@id"] !== deletedItem["@id"];
            });
        }
    }
}

export default defineNuxtPlugin({
    name: 'itemListStore',
    async setup({ $pinia }) {
        ($pinia as Pinia).use(itemListStorePlugin)
    }
})