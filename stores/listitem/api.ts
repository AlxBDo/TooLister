import { defineStore } from "pinia";
import type { TListItem } from "~/managers/ListItemForm";
import type { SubmissionErrors } from "~~/types/error";
import type { CreateItemApiData } from "~/models/api";

interface State {
  item?: TListItem;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useListItemApiStore = defineStore("listItemApi", {
  state: (): State => ({
    item: undefined,
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    setData({
      item,
      isLoading,
      error,
      violations,
    }: CreateItemApiData<TListItem>) {
      this.setItem(item.value);
      this.setLoading(isLoading.value);
      this.setViolations(violations.value);

      if (error.value instanceof Error) {
        this.setError(error.value?.message);
      }
    },

    setItem(item?: TListItem) {
      this.item = item;
    },

    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },

    setError(error: string | undefined) {
      this.error = error;
    },

    setViolations(violations: SubmissionErrors | undefined) {
      this.violations = violations;
    },
  },
});
