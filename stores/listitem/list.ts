import { defineStore } from "pinia";
import { fakeItemListActions, itemListState } from "~/utils/store";
import ListItemRepository from "~/repositories/ListItem";
import type { IItemListState } from "~/types/store";
import type { Liste } from "~/models/liste";
import type { TListItem } from "~/managers/ListItemForm";

interface State extends IItemListState<TListItem> {
  pendingRequest?: any
}

export const useListItemListStore = defineStore("listitemList", {
  state: (): State => ({
    ...itemListState<TListItem>()
  }),

  actions: {
    ...fakeItemListActions,

    searchItems(
      itemName: string,
      list: Liste,
      isLoading: Ref<boolean>,
      perfectMatch: Ref<TListItem | undefined>,
      itemsFound?: TListItem[]
    ) {
      if (this.pendingRequest) {
        clearTimeout(this.pendingRequest)
      }

      this.pendingRequest = setTimeout(() => {
        ListItemRepository.getListItems({ name: itemName }).then((listItemsResult) => {
          isLoading.value = false
          if (listItemsResult && listItemsResult.items?.value) {
            const searched = itemName.toLowerCase()
            const items = listItemsResult.items.value.reduce((listItems: TListItem[], listItem: TListItem) => {
              if (
                ![...listItems, ...(itemsFound ?? [])]?.find((item: TListItem) => item?.name === listItem.name)
              ) {
                if (listItem.list !== list['@id']) {
                  listItem = { name: listItem.name, '@id': undefined, id: undefined, list: list['@id'] }
                }
                if (searched === listItem.name?.toLowerCase()) {
                  perfectMatch.value = listItem
                }

                listItems.push(listItem)
              }
              return listItems
            }, [])

            this.setItems(items)
          }
        })
      }, 650)
    }
  },
});
