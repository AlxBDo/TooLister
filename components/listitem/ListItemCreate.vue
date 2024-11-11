<template>
  <nuxt-link :to="{ name: 'listitems' }" class="text-blue-600 hover:text-blue-800">
    &lt; Back to list
  </nuxt-link>

  <h1 class="text-3xl my-4">Create ListItem</h1>

  <div v-if="isLoading" class="bg-blue-100 rounded py-4 px-4 text-blue-700 text-sm" role="status">
    Loading...
  </div>

  <div v-if="error" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm" role="alert">
    {{ error }}
  </div>

  <Form :errors="violations" @submit="create" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import Form from "~~/components/listitem/ListItemForm.vue";
import { useListItemCreateStore } from "~~/stores/listitem/create";
import { useCreateItem } from "~~/composables/api";
import { getIdFromIri } from "~~/utils/resource";
import type { ListItem } from "~/models/listitem";

const listitemCreateStore = useListItemCreateStore();
const { created, isLoading, violations, error } = storeToRefs(listitemCreateStore);

async function create(item: ListItem) {
  const data = await useCreateItem<ListItem>("list_items", item);
  listitemCreateStore.setData(data);

  if (!created?.value?.["@id"]) {
    listitemCreateStore.setError("Missing item id. Please reload");
    return;
  }

  navigateTo({
    name: "listitems-id-edit",
    params: { id: getIdFromIri(created?.value?.["@id"]) },
  });
}

onBeforeUnmount(() => {
  listitemCreateStore.$reset();
});
</script>
