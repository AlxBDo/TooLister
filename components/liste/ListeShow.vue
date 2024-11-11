<script lang="ts" setup>
import { useListeShowStore } from "~~/stores/liste/show";
import { useFetchItem } from "~~/composables/api";
import type { Liste } from "~/models/liste";
import type { TListItem } from "~/managers/ListItemForm";
import type { TListTypes } from "~/managers/List";
import Form from "../listitem/Form.vue";
import type { ListItem } from "~/models/listitem";
import ListItemManager from "~/managers/ListItem";
import { useListeStore } from "~/stores/liste";
import { useListeListStore } from "~/stores/liste/list";
import ListItemCard from "../listitem/ListItemCard.vue";


const route = useRoute()

const displayItemForm = ref(false)
const itemFormData = ref<ListItem>({})
const itemIsPending = ref(0)

const listeShowStore = useListeShowStore()

const id = decodeURIComponent(route.params.id as string)

const list = ref<Liste>()
const listType = ref<TListTypes>("0")


usePersister().getItem('listeList').then((listesState) => {
  list.value = listesState && listesState.items.find((list: Liste) => list?.id == parseInt(id))
  if (list.value) {
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
  itemIsPending.value = 0
}

function itemFormToggle(item?: TListItem) {
  displayItemForm.value = !displayItemForm.value;
  if (displayItemForm.value && listType.value) {
    if (item) {
      itemIsPending.value = item.id ?? 0
    } else {
      item = { list: `/apip/listes/${list.value?.id}` }
    }
    itemFormData.value = item
  } else { itemFormData.value = {} }
};

function submitFormModal(data: Promise<TListItem>) {
  itemFormToggle()
  data.then(
    (listItem: TListItem) => updateListItems(listItem)
  )
    .finally(() => {
      if (itemIsPending.value > 0) {
        itemIsPending.value = 0
      }
    })
    .catch(e => console.error(e))

}

function updateListItems(listItem: TListItem) {
  if (list.value) {
    const listStore = useListeStore()
    listStore.setData(list.value)

    if (list.value.selectedItems?.find((i: TListItem) => i['@id'] === listItem.value['@id'])) {
      listStore.updateItems(listItem.value)
    } else {
      listStore.addItem(listItem.value)
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
  <h2>{{ list?.name }}</h2>
  <div v-if="list?.selectedItems">
    <ListItemCard v-for="listItem in list.selectedItems" :edit-function="() => itemFormToggle(listItem as TListItem)"
      :is-loading="itemIsPending === listItem?.id" :item="listItem"
      :list-type="ListItemManager.getItemType((list.type ?? '0') as TListTypes)" :key="listItem.id">
    </ListItemCard>
    <UModal v-model="displayItemForm" prevent-close>
      <UIcon name="i-mdi-close-box" @click="closeModal" class="float-right size-6 block" />
      <Form :list-item="itemFormData" :list-type="listType" :success-callback="submitFormModal"></Form>
    </UModal>
  </div>
</template>