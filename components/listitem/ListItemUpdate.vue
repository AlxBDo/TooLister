<template>
  <h1 class="text-3xl my-4">Edit ListItem {{ item?.["@id"] }}</h1>

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
import Form from "~~/components/listitem/ListItemForm.vue";
import { useListItemUpdateStore } from "~~/stores/listitem/update";
import { useListItemCreateStore } from "~~/stores/listitem/create";
import { useListItemDeleteStore } from "~~/stores/listitem/delete";
import { useMercureItem } from "~~/composables/mercureItem";
import { useFetchItem, useUpdateItem } from "~~/composables/api";
import type { SubmissionErrors } from "~~/types/error";
import type { ListItem } from "~/models/listitem";
import type { TListItem } from "~/managers/ListItemForm";

const route = useRoute();
const router = useRouter();

const listitemCreateStore = useListItemCreateStore();
const { created } = storeToRefs(listitemCreateStore);

const listitemDeleteStore = useListItemDeleteStore();
const { error: deleteError, deleted, isLoading: deleteLoading } =
  storeToRefs(listitemDeleteStore);

const listitemUpdateStore = useListItemUpdateStore();

useMercureItem({
  store: listitemUpdateStore,
  deleteStore: listitemDeleteStore,
  redirectRouteName: "listitems",
});

const listType = decodeURIComponent(route.params.type as string);
const id = decodeURIComponent(route.params.id as string);
let updated: Ref<TListItem | undefined> = ref(undefined);
let violations: Ref<SubmissionErrors | undefined> = ref(undefined);
let {
  retrieved: item,
  error,
  isLoading,
  hubUrl,
} = await useFetchItem<TListItem>(`list_items/${id}`);

listitemUpdateStore.setData({
  retrieved: item,
  error,
  isLoading,
  hubUrl,
});

async function update(payload: TListItem) {
  if (!item?.value) {
    listitemUpdateStore.setError("No item found. Please reload");
    return;
  }

  const data = await useUpdateItem<TListItem>(item.value, payload);
  updated.value = data.updated.value;
  violations.value = data.violations.value;
  isLoading.value = data.isLoading.value;
  error.value = data.error.value;
  listitemUpdateStore.setUpdateData(data);
}

async function deleteItem() {
  if (!item?.value) {
    listitemDeleteStore.setError("No item found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this listitem?")) {
    const { isLoading, error } = await useDeleteItem(item.value);

    if (error.value) {
      listitemDeleteStore.setError(error.value);
      return;
    }

    listitemDeleteStore.setLoading(Boolean(isLoading?.value));
    listitemDeleteStore.setDeleted(item.value);
    listitemDeleteStore.setMercureDeleted(undefined);

    if (deleted) {
      router.push({ name: "listitems" });
    }
  }
}

onBeforeUnmount(() => {
  listitemUpdateStore.$reset();
  listitemCreateStore.$reset();
  listitemDeleteStore.$reset();
});
</script>
