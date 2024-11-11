import { defineStore } from "pinia";
import type { ListItem } from "~/models/listitem";

interface State {
  deleted?: ListItem;
  mercureDeleted?: ListItem;
  isLoading: boolean;
  error?: string;
}

export const useListItemDeleteStore = defineStore("listitemDelete", {
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

    setDeleted(deleted: ListItem) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: ListItem | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
