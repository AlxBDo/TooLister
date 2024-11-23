import { defineStore } from "pinia"
import { fakeItemListActions, itemListState, persistedState } from "~/utils/store"
import type { Liste } from "~/models/liste"
import type { IItemListState, IPersistedState } from "~/types/store"


const logStyle = { bgColor: 'green', icon: '🧰' }

interface State extends IItemListState<Liste>, IPersistedState {
  pendings?: Array<number | string>;
}

export const useListeListStore = defineStore("listeList", {
  state: (): State => ({
    ...itemListState<Liste>(),
    ...persistedState(),
    pendings: []
  }),

  actions: {
    ...fakeItemListActions,

    addPendingItem(id: string | number) {
      this.pendings?.push(id)
    },

    removePendingItem(id: string | number) {
      this.pendings = this.pendings?.filter((pending) => pending !== id);
    }
  },
});
