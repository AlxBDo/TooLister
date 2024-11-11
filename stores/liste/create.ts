import { defineStore } from "pinia";
import { Liste } from "~/models/liste";
import type { SubmissionErrors } from "~~/types/error";
import { CreateItemData } from "~/models/api";

interface State {
  created?: Liste;
  isLoading: boolean;
  error?: string;
  violations?: SubmissionErrors;
}

export const useListeCreateStore = defineStore("listeCreate", {
  state: (): State => ({
    created: undefined,
    isLoading: false,
    error: undefined,
    violations: undefined,
  }),

  actions: {
    setData({ created, isLoading, error, violations }: CreateItemData<Liste>) {
      this.setCreated(created.value);
      this.setLoading(isLoading.value);
      this.setViolations(violations.value);

      if (error.value instanceof Error) {
        this.setError(error.value?.message);
      }
    },

    setCreated(created?: Liste) {
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
