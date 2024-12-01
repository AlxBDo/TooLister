import { defineStore } from "pinia";
import type { IItemListState, IPersistedState } from "~/types/store";
import { itemListState, persistedState } from "~/utils/store";
import type { Category } from "~/models/category";

interface State extends IItemListState<Category>, IPersistedState {
}

export const useCategoryListStore = defineStore("categoryList", {
  state: (): State => ({
    ...itemListState<Category>(),
    ...persistedState()
  }),

  actions: {
    ...fakeItemListActions
  }
});
