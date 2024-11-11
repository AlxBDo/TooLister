<template>
  <nuxt-link :to="{ name: 'shoppingitems' }" class="text-blue-600 hover:text-blue-800">
    &lt; Back to list
  </nuxt-link>

  <h1 class="text-3xl my-4">Create ShoppingItem</h1>

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
import Form from "~~/components/shoppingitem/ShoppingItemForm.vue";
import { useShoppingItemCreateStore } from "~~/stores/shoppingitem/create";
import { useCreateItem } from "~~/composables/api";
import { getIdFromIri } from "~~/utils/resource";
import type { ShoppingItem } from "~/models/shoppingitem";

const shoppingitemCreateStore = useShoppingItemCreateStore();
const { created, isLoading, violations, error } = storeToRefs(shoppingitemCreateStore);

async function create(item: ShoppingItem) {
  const data = await useCreateItem<ShoppingItem>("shopping_items", item);
  shoppingitemCreateStore.setData(data);

  if (!created?.value?.["@id"]) {
    shoppingitemCreateStore.setError("Missing item id. Please reload");
    return;
  }

  navigateTo({
    name: "shoppingitems-id-edit",
    params: { id: getIdFromIri(created?.value?.["@id"]) },
  });
}

onBeforeUnmount(() => {
  shoppingitemCreateStore.$reset();
});
</script>
