import { defineStore } from "pinia";
import type { GiftItem } from "~/models/giftitem";

interface State {
  deleted?: GiftItem;
  mercureDeleted?: GiftItem;
  isLoading: boolean;
  error?: string;
}

export const useGiftItemDeleteStore = defineStore("giftitemDelete", {
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

    setDeleted(deleted: GiftItem) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: GiftItem | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
