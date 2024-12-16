import { defineStore } from "pinia"
import { fakeItemListActions, itemListState, persistedState } from "~/utils/store"
import ListManager from "~/managers/List"
import ListRepository from "~/repositories/List"
import type { Liste } from "~/models/liste"
import type { IItemListState, IPersistedState } from "~/types/store"
import type { IListSearchCriteria } from "~/repositories/List"
import type { IAnyObject } from "~/types"
import type { StateTree, SubscriptionCallbackMutation } from "pinia"


const logStyle = { bgColor: 'green', icon: '🧰' }

interface State extends IItemListState<Liste>, IPersistedState {
  listsGroupByCategory: Ref<IAnyObject>;
  pendings?: Array<number | string>;
}

export const useListeListStore = defineStore("listeList", {
  state: (): State => ({
    ...itemListState<Liste>(),
    ...persistedState(),
    listsGroupByCategory: ref([]),
    pendings: []
  }),

  actions: {
    ...fakeItemListActions,

    addPendingItem(id: string | number) {
      this.pendings?.push(id)
    },

    async getLists(searchCriteria?: IListSearchCriteria) {
      searchCriteria = searchCriteria ?? { owner: useConnectedUser().user.id }

      if (!this.items || !this.items.length) {
        const result = await ListRepository.getLists(searchCriteria)
        this.setData(result)
      } else {
        ListRepository.getLists(searchCriteria).then((result) => {
          this.setData(result)
        });
      }

      return this.items
    },

    async getListsGroupByCategory() {
      if (!this.items.length) {
        await this.getLists()
      } else { this.getLists() }

      this.groupListByCategory(this.items)

      return this.listsGroupByCategory
    },

    groupListByCategory(lists: Liste[]) {
      this.listsGroupByCategory.value = arrayObjectGroupBy(lists, 'type')
    },

    mutationCallback(mutation: SubscriptionCallbackMutation<StateTree>) {
      const { key, newValue, oldValue, type } = mutation.events as IAnyObject

      //useConsole().log('mutationCallback', [key, newValue, oldValue, type, mutation])

      if (key === 'items' && Array.isArray(newValue)) {
        if (!Array.isArray(oldValue) || oldValue.length < newValue.length) {
          this.groupListByCategory(this.items)
        } else if (!Array.isArray(oldValue) || oldValue.length > newValue.length) {
          this.groupListByCategory(newValue)
        }
      } else if (type === 'add') {
        this.listsGroupByCategory.value = arrayObjectGroupBy(this.items, 'type')
        this.getListsGroupByCategory()
      }
    },

    removePendingItem(id: string | number) {
      this.pendings = this.pendings?.filter((pending) => pending !== id);
    },

    saveList(list: Liste) {
      useConsole().log('listeListStore saveList', [list])
      if (this.items.find((item: Liste) => item.id === list.id)) {
        this.updateItem(list, false)
      } else {
        this.addItem(list)
      }
    },

    saveListFromForm(formData: Liste, list: Promise<Ref<Liste>>) {
      let isNewItem = false
      if (!formData.id) {
        isNewItem = true
        formData.id = 0
        this.addItem(ListManager.createState(formData))
      }

      this.addPendingItem(formData.id)

      list.then(
        (list: Ref<Liste>) => {
          if (isNewItem) {
            this.deleteItem({ id: 0 })
            this.removePendingItem(0)
          }

          if (list.value?.id) {
            this.removePendingItem(list.value.id)
            this.saveList(toRaw(list.value))
          }
        }
      ).catch(e => console.error(e))
    }
  },
});
