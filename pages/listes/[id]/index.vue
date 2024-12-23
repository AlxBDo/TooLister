<script lang="ts" setup>
import { useListeShowStore } from "~/stores/liste/show";
import type { TListItem } from "~/managers/ListItemForm";
import Form from "~/components/listitem/Form.vue";
import type { ListItem } from "~/models/listitem";
import { useListeStore } from "~/stores/liste";
import { useListeListStore } from "~/stores/liste/list";
import BallsSpinner from "~/components/common/BallsSpinner.vue";
import Show from "~/components/liste/Show.vue";
import ListItemSearch from "~/components/listitem/ListItemSearch.vue";
import ListItemFormManager from "~/managers/ListItemForm";

const route = useRoute()
const displayItemForm = ref(false)
const itemFormData = ref<ListItem>({})
const pendingItem = ref(0)
const id = decodeURIComponent(route.params.id as string)

const listeShowStore = useListeShowStore()
await listeShowStore.getListById(parseInt(id))
const { list } = storeToRefs(listeShowStore)


function closeModal() {
  itemFormToggle()
  pendingItem.value = 0
}

function itemFormToggle(item?: TListItem) {
  displayItemForm.value = !displayItemForm.value;
  if (displayItemForm.value && list?.value && list.value.type) {
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
    (listItem: TListItem) => list?.value && ListItemFormManager.updateStore(list.value, listItem.value)
  ).finally(() => {
    if (pendingItem.value > 0) {
      pendingItem.value = 0
    }
  })
    .catch(e => console.error(e))
}

function updateListItems(listItem: TListItem) {
  if (list?.value) {
    const listStore = useListeStore()
    list.value = {
      ...list.value,
      selectedItems: list.value.selectedItems?.filter(item => item.id !== listItem.id)
    }
    listStore.setData(list.value)

    listStore.saveItem(listItem)

    const listListStore = useListeListStore()
    listListStore.updateItem(listStore.$state, false)
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
    <template v-else-if="list?.id">
      <div>
        <Show @remove-item="updateListItems" :edit-item-function="itemFormToggle" :list :pending-item />
        <ListItemSearch :click-item="updateListItems" :list :list-items="list.selectedItems" />
        <UModal v-model="displayItemForm" prevent-close>
          <UIcon name="i-mdi-close-box" @click="closeModal" class="float-right size-6 block" />
          <Form :list-item="itemFormData" :list-type="list?.type ?? '0'" :success-callback="submitFormModal">
          </Form>
        </UModal>
      </div>
    </template>
    <p v-else>Impossible de récupérer la liste !</p>
  </div>
</template>