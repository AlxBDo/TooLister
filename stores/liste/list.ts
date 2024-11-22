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

    stateIsEmpty: itemsAreEmpty
  },
});
