<template>
  <nuxt-link :to="{ name: 'giftitems' }" class="text-blue-600 hover:text-blue-800">
    &lt; Back to list
  </nuxt-link>

  <h1 class="text-3xl my-4">Create GiftItem</h1>

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
import Form from "~~/components/giftitem/GiftItemForm.vue";
import { useGiftItemCreateStore } from "~~/stores/giftitem/create";
import { useCreateItem } from "~~/composables/api";
import { getIdFromIri } from "~~/utils/resource";
import type { GiftItem } from "~/models/giftitem";

const giftitemCreateStore = useGiftItemCreateStore();
const { created, isLoading, violations, error } = storeToRefs(giftitemCreateStore);

async function create(item: GiftItem) {
  const data = await useCreateItem<GiftItem>("gift_items", item);
  giftitemCreateStore.setData(data);

  if (!created?.value?.["@id"]) {
    giftitemCreateStore.setError("Missing item id. Please reload");
    return;
  }

  navigateTo({
    name: "giftitems-id-edit",
    params: { id: getIdFromIri(created?.value?.["@id"]) },
  });
}

onBeforeUnmount(() => {
  giftitemCreateStore.$reset();
});
</script>
