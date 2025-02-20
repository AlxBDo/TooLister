import { defineStore } from "pinia"
import { fakeItemListActions, fakePersistActions, itemListState, persistedState } from "~/utils/store"
import ListManager from "~/managers/List"
import ListRepository, { type IListSearchCriteria } from "~/repositories/List"
import type { Liste } from "~/models/liste"
import type { AugmentOptionApiStore, AugmentStore, IItemListActions, IItemListState, IPersistedState, IPersistedStore } from "~/types/store"
import type { IAnyObject } from "~/types"
import type { StateTree, SubscriptionCallbackMutation } from "pinia"
import type { Item } from "~/models/item"


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

type AugmentingStore = () => AugmentOptionApiStore<Partial<IListeListStore>, Partial<IListeListState>>


export const useListeListStore: AugmentingStore = defineStore("listeList", {
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
    ...fakeItemListActions,

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

  /**
  let { items, isLoading, error, hubUrl } = itemListState<Liste>()
  const { persist, persistedPropertiesToEncrypt, excludedKeys, isEncrypted } = persistedState(
    true,
    [
      'error',
      'hubUrl',
      'isEncrypted',
      'isLoading',
      'persist',
      'persistedPropertiesToEncrypt',
      'rewritedActions',
      'listsGroupByCategory',
      'pendings'
    ]
  )

  const listsGroupByCategory = ref<IAnyObject>({})

  const pendings = ref<Array<string | number>>([])


  const {
    addItem, deleteItem, setData, setError, getItem, getItems, setHubUrl, setItems, setLoading, updateItem
  } = fakeItemListActions


  function addPendingItem(id: string | number) {
    pendings.value.push(id)
  }

  async function getLists(searchCriteria?: IListSearchCriteria) {
    searchCriteria = searchCriteria ?? { owner: useConnectedUser().user.id }
    isLoading = true

    if (!items || !items.length) {
      const result = await ListRepository.getLists(searchCriteria)
      setData(result)
    } else {
      ListRepository.getLists(searchCriteria).then((result) => {
        setData(result)
      });
    }

    isLoading = false

    return items
  }

  async function getListsGroupByCategory() {
    if (!items.length) {
      await getLists()
    } else { getLists() }

    groupListByCategory(items)

    return listsGroupByCategory
  }

  function groupListByCategory(lists: Liste[]) {
    listsGroupByCategory.value = arrayObjectGroupBy(lists, 'type')
  }

  function mutationCallback(mutation: SubscriptionCallbackMutation<StateTree>) {
    const { key, newValue, oldValue, type } = mutation.events as IAnyObject

    //useConsole().log('mutationCallback', [key, newValue, oldValue, type, mutation])

    if (key === 'items' && Array.isArray(newValue)) {
      if (!Array.isArray(oldValue) || oldValue.length < newValue.length) {
        groupListByCategory(items)
      } else if (!Array.isArray(oldValue) || oldValue.length > newValue.length) {
        groupListByCategory(newValue)
      }
    } else if (type === 'add') {
      listsGroupByCategory.value = arrayObjectGroupBy(items, 'type')
      getListsGroupByCategory()
    }
  }

  function removePendingItem(id: string | number) {
    pendings.value = pendings.value.filter((pending) => pending !== id);
  }

  function saveList(list: Liste) {
    if (items.find((item: Liste) => item.id === list.id)) {
      updateItem(list, false)
    } else {
      addItem(list)
    }
  }

  function saveListFromForm(formData: Liste, list: Promise<Ref<Liste>>) {
    let isNewItem = false
    if (!formData.id) {
      isNewItem = true
      formData.id = 0
      addItem(ListManager.createState(formData))
    }

    addPendingItem(formData.id)

    list.then(
      (list: Ref<Liste>) => {
        if (isNewItem) {
          deleteItem({ id: 0 })
          removePendingItem(0)
        }

        if (list.value?.id) {
          removePendingItem(list.value.id)
          saveList(toRaw(list.value))
        }
      }
    ).catch(e => console.error(e))
  }


  return {
    error,
    excludedKeys,
    hubUrl,
    items,
    isEncrypted,
    isLoading,
    listsGroupByCategory,
    pendings,
    persist,
    persistedPropertiesToEncrypt,
    addItem, deleteItem, setData, setError, getItem, getItems, setHubUrl, setItems, setLoading, updateItem,
    addPendingItem, getLists, getListsGroupByCategory, mutationCallback, removePendingItem, saveList, saveListFromForm
  }
  
   */
});
