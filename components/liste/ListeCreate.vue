<template>
  <nuxt-link :to="{ name: 'listes' }" class="text-blue-600 hover:text-blue-800">
    &lt; Back to list
  </nuxt-link>

  <h1 class="text-3xl my-4">Create Liste</h1>

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
import Form from "~~/components/liste/ListeForm.vue";
import { useListeCreateStore } from "~~/stores/liste/create";
import { useCreateItem } from "~~/composables/api";
import { getIdFromIri } from "~~/utils/resource";
import type { Liste } from "~/models/liste";

const listeCreateStore = useListeCreateStore();
const { created, isLoading, violations, error } = storeToRefs(listeCreateStore);

async function create(item: Liste) {
  const data = await useCreateItem<Liste>("listes", item);
  listeCreateStore.setData(data);

  if (!created?.value?.["@id"]) {
    listeCreateStore.setError("Missing item id. Please reload");
    return;
  }

  navigateTo({
    name: "listes-id-edit",
    params: { id: getIdFromIri(created?.value?.["@id"]) },
  });
}

onBeforeUnmount(() => {
  listeCreateStore.$reset();
});
</script>
