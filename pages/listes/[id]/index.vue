<script lang="ts" setup>
import type { ListItem } from "~/models/listitem"
import type { TListItem } from "~/managers/ListItemForm"
import BallsSpinner from "~/components/common/BallsSpinner.vue";
import Form from "~/components/listitem/Form.vue"
import ListItemSearch from "~/components/listitem/ListItemSearch.vue"
import Show from "~/components/liste/Show.vue"
import { useListeShowStore } from "~/stores/liste/show"
import { useListeStore } from "~/stores/liste"

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
}

function saveListItem(listItem: TListItem) {
  if (!list?.value) { return }

  const listStore = useListeStore()
  listStore.setData(list.value)
  listStore.saveItem(listItem)
}

function submitFormModal(data: Promise<TListItem>) {
  itemFormToggle()

  data.then(saveListItem).finally(() => {
    if (pendingItem.value > 0) {
      pendingItem.value = 0
    }
  }).catch(e => console.error(e))
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
    <div v-else-if="list?.id">
      <Show @remove-item="saveListItem" :edit-item-function="itemFormToggle" :list :pending-item />
      <ListItemSearch :click-item="saveListItem" :list :list-items="list.selectedItems" />
      <UModal v-model="displayItemForm" prevent-close>
        <UContainer>
          <UIcon name="i-mdi-close-box" @click="closeModal" class="float-right size-6 block mt-5" />
          <Form class="my-12" :list-item="itemFormData" :list-type="list?.type ?? '0'"
            :success-callback="submitFormModal"></Form>
        </UContainer>
      </UModal>
    </div>
    <p v-else>Impossible de récupérer la liste !</p>
  </div>
</template>