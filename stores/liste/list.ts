import { defineStore } from "pinia"
import type { Liste } from "~/models/liste"
import type { View } from "~~/types/view"
import type { FetchAllData } from "~/models/api"
import { itemsAreEmpty } from "~/utils/validation/store"


const logStyle = { bgColor: 'orange', icon: '🧰' }

interface State {
  items: Liste[];
  hubUrl?: URL;
  isLoading: boolean;
  persist: boolean;
  pendings?: Array<number | string>;
  view?: View;
  error?: string;
}

export const useListeListStore = defineStore("listeList", {
  state: (): State => ({
    items: [],
    isLoading: false,
    error: undefined,
    hubUrl: undefined,
    persist: true,
    pendings: [],
    view: undefined,
  }),

  actions: {
    addItem(item: Liste) {
      this.items.push(item);
    },

    addPendingItem(id: string | number) {
      this.pendings?.push(id)
    },

    removeItem(id: string | number) {
      this.items = this.items?.filter((list: Liste) => list.id !== id);
    },

    removePendingItem(id: string | number) {
      this.pendings = this.pendings?.filter((pending) => pending !== id);
    },

    setData({ items, view, isLoading, error, hubUrl }: FetchAllData<Liste>) {
      this.setItems(items.value);
      this.setLoading(isLoading.value);
      if (hubUrl) this.setHubUrl(hubUrl.value);
      if (view) this.setView(view.value);

      if (error.value instanceof Error) {
        this.setError(error.value?.message);
      }
    },

    setLoading(isLoading: boolean) {
      this.isLoading = isLoading;
    },

    setItems(items: Liste[]) {
      this.items = items;
    },

    setHubUrl(hubUrl?: URL) {
      this.hubUrl = hubUrl;
    },

    setView(view?: View) {
      this.view = view;
    },

    setError(error?: string) {
      this.error = error;
    },

    stateIsEmpty: itemsAreEmpty,

    updateItem(updatedItem: Liste) {
      const item: Liste | undefined = this.items.find(
        (i) => i["@id"] === updatedItem["@id"] || (!i["@id"] && i.name === updatedItem.name)
      );

      if (!item) {
        this.items.push(updatedItem)
        return
      }

      Object.assign(item, updatedItem)
    },

    deleteItem(deletedItem: Liste) {
      this.items = this.items.filter((item) => {
        return item["@id"] !== deletedItem["@id"];
      });
    },
  },
});
