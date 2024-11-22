import { defineStore } from "pinia";
import type { TListItem } from "~/managers/ListItemForm";
import type { View } from "~~/types/view";
import type { FetchAllData } from "~/models/api";
import type { IItemListState, IPersistedState } from "~/types/store";
import { itemListState } from "~/utils/store";
import type { Category } from "~/models/category";

interface State extends IItemListState<Category>, IPersistedState {
}

export const useCategoryListStore = defineStore("categoryList", {
  state: (): State => ({
    ...itemListState,
    persist: true
  }),

  actions: {
    setData({ items, isLoading, error, hubUrl }: FetchAllData<Category>) {
      this.setItems(items.value);
      this.setLoading(isLoading.value);
      if (hubUrl) this.setHubUrl(hubUrl.value);

      if (error.value instanceof Error) {
        this.setError(error.value?.message);
      }
    },

    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },

    setItems(items: Category[]) {
      this.items = items;
    },

    setHubUrl(hubUrl?: URL) {
      this.hubUrl = hubUrl;
    },

    setView(view?: View) {
      this.view = view;
    },

    setError(error?: string) {
      this.error = error;
    },

    stateIsEmpty(): boolean {
      return this.items.length === 0;
    },

    updateItem(updatedItem: Category) {
      const item: TListItem | undefined = this.items.find(
        (i) => i["@id"] === updatedItem["@id"]
      );

      if (!item) return;

      Object.assign(item, updatedItem);
    },

    deleteItem(deletedItem: Category) {
      this.items = this.items.filter((item) => {
        return item["@id"] !== deletedItem["@id"];
      });
    },
  },
});
