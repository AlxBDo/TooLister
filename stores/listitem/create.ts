import { defineStore } from "pinia";
import { ListItem } from "~/models/listitem";
import type { SubmissionErrors } from "~~/types/error";
import { CreateItemData } from "~/models/api";

interface State {
  created?: ListItem;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useListItemCreateStore = defineStore("listitemCreate", {
  state: (): State => ({
    created: undefined,
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    setData({
      created,
      isLoading,
      error,
      violations,
    }: CreateItemData<ListItem>) {
      this.setCreated(created.value);
      this.setLoading(isLoading.value);
      this.setViolations(violations.value);

      if (error.value instanceof Error) {
        this.setError(error.value?.message);
      }
    },

    setCreated(created?: ListItem) {
      this.created = created;
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
