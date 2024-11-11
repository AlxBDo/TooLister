<template>
  <div class="flex items-center justify-between">
    <nuxt-link :to="{ name: 'giftitems' }" class="text-blue-600 hover:text-blue-800">
      &lt; Back to list
    </nuxt-link>

    <button class="px-6 py-2 bg-red-600 text-white text-xs rounded shadow-md hover:bg-red-700" @click="deleteItem">
      Delete
    </button>
  </div>

  <h1 class="text-3xl my-4">Edit GiftItem {{ item?.["@id"] }}</h1>

  <div v-if="isLoading || deleteLoading" class="bg-blue-100 rounded py-4 px-4 text-blue-700 text-sm" role="status">
    Loading...
  </div>

  <div v-if="error || deleteError" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm" role="alert">
    {{ error || deleteError }}
  </div>

  <div v-if="created || updated" class="bg-green-100 rounded py-4 px-4 my-2 text-green-700 text-sm" role="status">
    <template v-if="updated">{{ updated["@id"] }} updated.</template>
    <template v-else-if="created">{{ created["@id"] }} created.</template>
  </div>

  <Form :values="item" :errors="violations" @submit="update" />
</template>

<script lang="ts" setup>
import { Ref } from "vue";
import { storeToRefs } from "pinia";
import Form from "~~/components/giftitem/GiftItemForm.vue";
import { useGiftItemUpdateStore } from "~~/stores/giftitem/update";
import { useGiftItemCreateStore } from "~~/stores/giftitem/create";
import { useGiftItemDeleteStore } from "~~/stores/giftitem/delete";
import { useMercureItem } from "~~/composables/mercureItem";
import { useFetchItem, useUpdateItem } from "~~/composables/api";
import { SubmissionErrors } from "~~/types/error";
import type { GiftItem } from "~/models/giftitem";

const route = useRoute();
const router = useRouter();

const giftitemCreateStore = useGiftItemCreateStore();
const { created } = storeToRefs(giftitemCreateStore);

const giftitemDeleteStore = useGiftItemDeleteStore();
const { error: deleteError, deleted, isLoading: deleteLoading } =
  storeToRefs(giftitemDeleteStore);

const giftitemUpdateStore = useGiftItemUpdateStore();

useMercureItem({
  store: giftitemUpdateStore,
  deleteStore: giftitemDeleteStore,
  redirectRouteName: "giftitems",
});

const id = decodeURIComponent(route.params.id as string);
let updated: Ref<GiftItem | undefined> = ref(undefined);
let violations: Ref<SubmissionErrors | undefined> = ref(undefined);
let {
  retrieved: item,
  error,
  isLoading,
  hubUrl,
} = await useFetchItem<GiftItem>(`gift_items/${id}`);
giftitemUpdateStore.setData({
  retrieved: item,
  error,
  isLoading,
  hubUrl,
});

async function update(payload: GiftItem) {
  if (!item?.value) {
    giftitemUpdateStore.setError("No item found. Please reload");
    return;
  }

  const data = await useUpdateItem<GiftItem>(item.value, payload);
  updated.value = data.updated.value;
  violations.value = data.violations.value;
  isLoading.value = data.isLoading.value;
  error.value = data.error.value;
  giftitemUpdateStore.setUpdateData(data);
}

async function deleteItem() {
  if (!item?.value) {
    giftitemDeleteStore.setError("No item found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this giftitem?")) {
    const { isLoading, error } = await useDeleteItem(item.value);

    if (error.value) {
      giftitemDeleteStore.setError(error.value);
      return;
    }

    giftitemDeleteStore.setLoading(Boolean(isLoading?.value));
    giftitemDeleteStore.setDeleted(item.value);
    giftitemDeleteStore.setMercureDeleted(undefined);

    if (deleted) {
      router.push({ name: "giftitems" });
    }
  }
}

onBeforeUnmount(() => {
  giftitemUpdateStore.$reset();
  giftitemCreateStore.$reset();
  giftitemDeleteStore.$reset();
});
</script>
