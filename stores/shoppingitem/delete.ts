import { defineStore } from "pinia";
import type { ShoppingItem } from "~/models/shoppingitem";

interface State {
  deleted?: ShoppingItem;
  mercureDeleted?: ShoppingItem;
  isLoading: boolean;
  error?: string;
}

export const useShoppingItemDeleteStore = defineStore("shoppingitemDelete", {
  state: (): State => ({
    deleted: undefined,
    mercureDeleted: undefined,
    isLoading: false,
    error: undefined,
  }),

  actions: {
    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },

    setDeleted(deleted: ShoppingItem) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: ShoppingItem | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
