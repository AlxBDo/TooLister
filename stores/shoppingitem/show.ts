import { defineStore } from "pinia";
import type { ShoppingItem } from "~/models/shoppingitem";
import { FetchItemData } from "~/models/api";
interface State {
  retrieved?: ShoppingItem;
  isLoading: boolean;
  error?: string;
  hubUrl?: URL;
}

export const useShoppingItemShowStore = defineStore("shoppingitemShow", {
  state: (): State => ({
    retrieved: undefined,
    isLoading: false,
    error: "",
    hubUrl: undefined,
  }),

  actions: {
    setData({
      retrieved,
      isLoading,
      error,
      hubUrl,
    }: FetchItemData<ShoppingItem>) {
      this.setRetrieved(retrieved.value);
      this.setLoading(isLoading.value);
      this.setHubUrl(hubUrl.value);

      if (error.value instanceof Error) {
        this.setError(error.value?.message);
      }
    },

    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },

    setRetrieved(retrieved?: ShoppingItem) {
      this.retrieved = retrieved;
    },

    setHubUrl(hubUrl?: URL) {
      this.hubUrl = hubUrl;
    },

    setError(error?: string) {
      this.error = error;
    },
  },
});
