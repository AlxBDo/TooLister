import { defineStore } from "pinia";
import CategoryRepository, { type ISearchCategoryParams } from "~/repositories/Category";
import { itemListState, persistedState } from "~/utils/store";
import type { IItemListState, IPersistedState } from "~/types/store";
import type { Category } from "~/models/category";

interface State extends IItemListState<Category>, IPersistedState {
}

export const useCategoryListStore = defineStore("categoryList", {
  state: (): State => ({
    ...itemListState<Category>(),
    ...persistedState()
  }),

  actions: {
    ...fakeItemListActions,

    searchCategories(searchParams: ISearchCategoryParams): Category[] {
      if (this.items && this.items.length) {
        this.items = arrayObjectFindAllBy(this.items, searchParams)
      }

      CategoryRepository.getCategories(searchParams).then(result => this.setData(result))

      return this.items
    }
  }
});
