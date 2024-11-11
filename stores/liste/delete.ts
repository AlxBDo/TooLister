import { defineStore } from "pinia";
import type { Liste } from "~/models/liste";

interface State {
  deleted?: Liste;
  mercureDeleted?: Liste;
  isLoading: boolean;
  error?: string;
}

export const useListeDeleteStore = defineStore("listeDelete", {
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

    setDeleted(deleted: Liste) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: Liste | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
