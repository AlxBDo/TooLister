<script lang="ts" setup>
import { useListeShowStore } from "~/stores/liste/show";
import { useFetchItem } from "~/composables/api";
import type { Liste } from "~/models/liste";
import type { TListItem } from "~/managers/ListItemForm";
import Form from "~/components/listitem/Form.vue";
import type { ListItem } from "~/models/listitem";
import type { TListTypes } from "~/types/list";
import { useListeStore } from "~/stores/liste";
import { useListeListStore } from "~/stores/liste/list";
import BallsSpinner from "~/components/common/BallsSpinner.vue";
import Show from "~/components/liste/Show.vue";
import ListItemSearch from "~/components/listitem/ListItemSearch.vue";
import CategoryManager from "~/managers/Category";


const route = useRoute()

const displayItemForm = ref(false)
const itemFormData = ref<ListItem>({})
const pendingItem = ref(0)

const listeShowStore = useListeShowStore()
listeShowStore.setLoading(true)

const id = decodeURIComponent(route.params.id as string)

const list = ref<Liste>()
const listType = ref<TListTypes>("0")


usePersister().getItem('listeList').then((listesState) => {
  list.value = listesState && listesState.items.find((list: Liste) => list?.id == parseInt(id))
  if (list.value) {
    listeShowStore.setLoading(false)
    listType.value = list.value.type as TListTypes
  }
})


useFetchItem<Liste>(`listes/${id}`).then((fetchResult) => {
  listeShowStore.setData(fetchResult)
  if (listeShowStore?.retrieved) {
    list.value = listeShowStore?.retrieved
    listType.value = listeShowStore?.retrieved.type as TListTypes
  }
})


function closeModal() {
  itemFormToggle()
  pendingItem.value = 0
}

function itemFormToggle(item?: TListItem) {
  displayItemForm.value = !displayItemForm.value;
  if (displayItemForm.value && listType.value) {
    if (item) {
      pendingItem.value = item.id ?? 0
    } else {
      item = { list: `/apip/listes/${list.value?.id}` }
    }
    itemFormData.value = item
  } else { itemFormData.value = {} }
};

function submitFormModal(data: Promise<TListItem>) {
  itemFormToggle()
  data.then(
    (listItem: TListItem) => updateListItems(listItem?.value)
  )
    .finally(() => {
      if (pendingItem.value > 0) {
        pendingItem.value = 0
      }
    })
    .catch(e => console.error(e))

}

function updateListItems(listItem: TListItem) {
  if (list.value) {
    const listStore = useListeStore()
    listStore.setData(list.value)

    if (listItem.category) {
      if (typeof listItem.category === 'string') {
        listItem.category = CategoryManager.populateCategory({ '@id': listItem.category })
      } else if (typeof listItem.category === 'object' && (!listItem.category.id || !listItem.category.name)) {
        listItem.category = { ...CategoryManager.populateCategory(listItem.category), ...listItem.category }
      }
    }

    let items = [] as TListItem[]
    if (list.value.selectedItems) { items = list.value.selectedItems }
    if (list.value.unselectedItems) { items = [...items, list.value.unselectedItems] }

    if (items.find((i: TListItem) => i['@id'] === listItem['@id'])) {
      listStore.updateItems(listItem)
    } else {
      listStore.addItem(listItem)
    }

    const listListStore = useListeListStore()
    listListStore.updateItem(listStore.$state)
  }
}


onBeforeUnmount(() => {
  listeShowStore.$reset();
});
</script>

<template>
  <div class="container mx-auto px-4 max-w-2xl mt-4">
    <div v-if="listeShowStore.isLoading">
      <p class="mb-5">Chargement de la liste...</p>
      <BallsSpinner />
    </div>
    <template v-else-if="list">
      <div>
        <Show @remove-item="updateListItems" :edit-item-function="itemFormToggle" :list :pending-item />
        <ListItemSearch :click-item="updateListItems" :list :list-items="list.selectedItems" />
        <UModal v-model="displayItemForm" prevent-close>
          <UIcon name="i-mdi-close-box" @click="closeModal" class="float-right size-6 block" />
          <Form :list-item="itemFormData" :list-type="listType" :success-callback="submitFormModal"></Form>
        </UModal>
      </div>
    </template>
    <p v-else>Impossible de récupérer la liste !</p>
  </div>
</template>