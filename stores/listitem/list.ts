import { defineStore } from "pinia";
import { fakeItemListActions, itemListState } from "~/utils/store";
import ListItemFormManager from "~/managers/ListItemForm";
import ListItemRepository from "~/repositories/ListItem";
import type { IItemListState } from "~/types/store";
import type { Liste } from "~/models/liste";
import type { TListItem } from "~/managers/ListItemForm";

interface State extends IItemListState<TListItem> {
  pendingRequest?: any
  perfectMatch: TListItem | undefined
}

export const useListItemListStore = defineStore("listitemList", {
  state: (): State => ({
    ...itemListState<TListItem>(),
    perfectMatch: undefined
  }),

  actions: {
    ...fakeItemListActions,

    async save(item: TListItem, list: Liste): Promise<Ref<TListItem | undefined> | undefined> {
      const listItem = { ...item, status: 1, list: `/apip/listes/${list?.id}` }
      this.perfectMatch = listItem
      this.setItems([listItem])

      const requestResult = await ListItemFormManager.save(
        list.type ?? "0",
        listItem,
        item['@id'] ? item : undefined
      )

      this.$reset()

      return requestResult
    },

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

      if (itemName.length > 1) {
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

      useConsole().log('ListItemListStore', [list?.unselectedItems, list.unselectedItems && arrayObjectFindAllBy(list.unselectedItems, { name: itemName })])

      if (list.unselectedItems && list.unselectedItems.length) {
        this.setItems(arrayObjectFindAllBy(list.unselectedItems, { name: itemName }, false))
      }
    }
  },
});
