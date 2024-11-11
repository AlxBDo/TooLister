import { defineStore } from "pinia";
import { TaskItem } from "~/models/taskitem";
import type { SubmissionErrors } from "~~/types/error";
import { CreateItemData } from "~/models/api";

interface State {
  created?: TaskItem;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useTaskItemCreateStore = defineStore("taskitemCreate", {
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
    }: CreateItemData<TaskItem>) {
      this.setCreated(created.value);
      this.setLoading(isLoading.value);
      this.setViolations(violations.value);

      if (error.value instanceof Error) {
        this.setError(error.value?.message);
      }
    },

    setCreated(created?: TaskItem) {
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
