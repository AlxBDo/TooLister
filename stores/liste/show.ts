import { defineStore } from "pinia";
import type { Liste } from "~/models/liste";
import type { FetchItemData } from "~/models/api";
interface State {
  retrieved?: Liste;
  isLoading: boolean;
  error?: string;
  hubUrl?: URL;
}

export const useListeShowStore = defineStore("listeShow", {
  state: (): State => ({
    retrieved: undefined,
    isLoading: false,
    error: "",
    hubUrl: undefined,
  }),

  actions: {
    setData({ retrieved, isLoading, error, hubUrl }: FetchItemData<Liste>) {
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

    setRetrieved(retrieved?: Liste) {
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
