import { defineStore } from "pinia";
import type { TaskItem } from "~/models/taskitem";

interface State {
  deleted?: TaskItem;
  mercureDeleted?: TaskItem;
  isLoading: boolean;
  error?: string;
}

export const useTaskItemDeleteStore = defineStore("taskitemDelete", {
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

    setDeleted(deleted: TaskItem) {
      this.deleted = deleted;
    },

    setMercureDeleted(mercureDeleted: TaskItem | undefined) {
      this.mercureDeleted = mercureDeleted;
    },

    setError(error: string) {
      this.error = error;
    },
  },
});
