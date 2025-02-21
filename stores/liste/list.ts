import { defineStore } from "pinia"
import { itemListState, persistedState } from "~/utils/store"
import ListManager from "~/managers/List"
import ListRepository, { type IListSearchCriteria } from "~/repositories/List"
import type { Liste } from "~/models/liste"
import type { IItemListActions, IItemListState, IPersistedState, IPersistedStore } from "~/types/store"
import type { IAnyObject } from "~/types"
import type { StateTree, SubscriptionCallbackMutation } from "pinia"


export interface IListeListState extends IItemListState<Liste>, IPersistedState {
  listsGroupByCategory: IAnyObject;
  pendings: Array<number | string>;
}

export interface IListeListStore extends IItemListActions, IPersistedStore {
  addPendingItem: (id: string | number) => void
  getLists: (searchCriteria?: IListSearchCriteria) => Promise<Liste[]>
  getListsGroupByCategory: () => IAnyObject
  groupListByCategory: (lists: Liste[]) => void
  mutationCallback: (mutation: SubscriptionCallbackMutation<StateTree>) => void
  removePendingItem: (id: string | number) => void
  saveListFromForm: (formData: Liste, list: Promise<Ref<Liste>>) => void
}


const logStyle = { bgColor: 'green', icon: '🧰' }


export const useListeListStore = defineStore("listeList", {
  state: (): IListeListState => ({
    ...itemListState<Liste>(),
    ...persistedState(),
    excludedKeys: [
      'error',
      'hubUrl',
      'isEncrypted',
      'isLoading',
      'persist',
      'persistedPropertiesToEncrypt',
      'rewritedActions',
      'pendings'
    ],
    listsGroupByCategory: {} as IAnyObject,
    pendings: []
  }),

  actions: {
    addPendingItem(id: string | number) {
      this.pendings?.push(id)
    },

    async getLists(searchCriteria?: IListSearchCriteria) {
      searchCriteria = searchCriteria ?? { owner: useConnectedUser().user.id }
      this.isLoading = true

      if (!this.items || !this.items.length) {
        const result = await ListRepository.getLists(searchCriteria)
        this.setData(result)
      } else {
        ListRepository.getLists(searchCriteria).then((result) => {
          this.setData(result)
        });
      }

      this.isLoading = false

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
      this.listsGroupByCategory = arrayObjectGroupBy(lists, 'type')
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
  }
});
