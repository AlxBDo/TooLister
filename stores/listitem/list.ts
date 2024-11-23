import { defineStore } from "pinia";
import { fakeItemListActions, itemListState } from "~/utils/store";
import type { IItemListState } from "~/types/store";
import type { TListItem } from "~/managers/ListItemForm";


export const useListItemListStore = defineStore("listitemList", {
  state: (): IItemListState<TListItem> => ({
    ...itemListState<TListItem>()
  }),

  actions: {
    ...fakeItemListActions
  },
});
