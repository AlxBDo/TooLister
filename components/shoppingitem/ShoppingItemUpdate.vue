<template>
  <h1 class="text-3xl my-4">Edit ShoppingItem {{ item?.["@id"] }}</h1>

  <div v-if="isLoading" class="bg-blue-100 rounded py-4 px-4 text-blue-700 text-sm" role="status">
    Loading...
  </div>

  <div v-if="error" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm" role="alert">
    {{ error }}
  </div>

  <div v-if="created || updated" class="bg-green-100 rounded py-4 px-4 my-2 text-green-700 text-sm" role="status">
    <template v-if="updated">{{ updated["@id"] }} updated.</template>
    <template v-else-if="created">{{ created["@id"] }} created.</template>
  </div>

  <Form :values="item" :errors="violations" @submit="update" />
</template>

<script lang="ts" setup>
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import Form from "~~/components/shoppingitem/ShoppingItemForm.vue";
import { useShoppingItemUpdateStore } from "~~/stores/shoppingitem/update";
import { useShoppingItemCreateStore } from "~~/stores/shoppingitem/create";
import { useShoppingItemDeleteStore } from "~~/stores/shoppingitem/delete";
import { useMercureItem } from "~~/composables/mercureItem";
import { useFetchItem, useUpdateItem } from "~~/composables/api";
import type { SubmissionErrors } from "~~/types/error";
import type { ShoppingItem } from "~/models/shoppingitem";

const route = useRoute();
const router = useRouter();

const shoppingitemCreateStore = useShoppingItemCreateStore();
const { created } = storeToRefs(shoppingitemCreateStore);

const shoppingitemDeleteStore = useShoppingItemDeleteStore();
const { error: deleteError, deleted, isLoading: deleteLoading } =
  storeToRefs(shoppingitemDeleteStore);

const shoppingitemUpdateStore = useShoppingItemUpdateStore();

useMercureItem({
  store: shoppingitemUpdateStore,
  deleteStore: shoppingitemDeleteStore,
  redirectRouteName: "shoppingitems",
});

const id = decodeURIComponent(route.params.id as string);
let updated: Ref<ShoppingItem | undefined> = ref(undefined);
let violations: Ref<SubmissionErrors | undefined> = ref(undefined);
let {
  retrieved: item,
  error,
  isLoading,
  hubUrl,
} = await useFetchItem<ShoppingItem>(`shopping_items/${id}`);
shoppingitemUpdateStore.setData({
  retrieved: item,
  error,
  isLoading,
  hubUrl,
});

async function update(payload: ShoppingItem) {
  if (!item?.value) {
    shoppingitemUpdateStore.setError("No item found. Please reload");
    return;
  }

  const data = await useUpdateItem<ShoppingItem>(item.value, payload);
  updated.value = data.updated.value;
  violations.value = data.violations.value;
  isLoading.value = data.isLoading.value;
  error.value = data.error.value;
  shoppingitemUpdateStore.setUpdateData(data);
}

async function deleteItem() {
  if (!item?.value) {
    shoppingitemDeleteStore.setError("No item found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this shoppingitem?")) {
    const { isLoading, error } = await useDeleteItem(item.value);

    if (error.value) {
      shoppingitemDeleteStore.setError(error.value);
      return;
    }

    shoppingitemDeleteStore.setLoading(Boolean(isLoading?.value));
    shoppingitemDeleteStore.setDeleted(item.value);
    shoppingitemDeleteStore.setMercureDeleted(undefined);

    if (deleted) {
      router.push({ name: "shoppingitems" });
    }
  }
}

onBeforeUnmount(() => {
  shoppingitemUpdateStore.$reset();
  shoppingitemCreateStore.$reset();
  shoppingitemDeleteStore.$reset();
});
</script>
