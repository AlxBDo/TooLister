import { defineStore } from "pinia";
import ListRepository from "~/repositories/List";
import type { Liste } from "~/models/liste";
import type { FetchItemData } from "~/models/api";


interface State {
  isLoading: boolean;
  list?: Liste;
  error?: string;
  hubUrl?: URL;
}


export const useListeShowStore = defineStore("listeShow", {
  state: (): State => ({
    list: undefined,
    isLoading: false,
    error: "",
    hubUrl: undefined,
  }),

  actions: {
    async getListById(id: number): Promise<Liste> {
      if (!this.list || !this.list?.id || this.list?.id !== id) {
        this.isLoading = true

        this.setList(
          await this.getStoredListById(id)
        )

        ListRepository.getListById(id).then((fetchResult) => {
          if (!this.list?.id || this.list?.id === id) {
            this.setData(fetchResult)
            if (this.isLoading) { this.isLoading = false }
          }
        })
      }

      if (this.isLoading && this.list?.id && this.list.id === id) { this.isLoading = false }

      return this.list as Liste
    },

    async getStoredListById(id: number) {
      return await usePersister().getItem(`list_${id}`)
    },

    setData({ retrieved, isLoading, error, hubUrl }: FetchItemData<Liste>) {
      this.setList(retrieved.value);
      this.setLoading(isLoading.value);
      this.setHubUrl(hubUrl.value);

      if (error.value instanceof Error) {
        this.setError(error.value?.message);
      }
    },

    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },

    setList(retrieved?: Liste) {
      this.list = retrieved;
    },

    setHubUrl(hubUrl?: URL) {
      this.hubUrl = hubUrl;
    },

    setError(error?: string) {
      this.error = error;
    },
  },
});
