<template>
  <div class="flex items-center justify-between">
    <nuxt-link :to="{ name: 'listes' }" class="text-blue-600 hover:text-blue-800">
      &lt; Back to list
    </nuxt-link>

    <button class="px-6 py-2 bg-red-600 text-white text-xs rounded shadow-md hover:bg-red-700" @click="deleteItem">
      Delete
    </button>
  </div>

  <h1 class="text-3xl my-4">Edit Liste {{ item?.["@id"] }}</h1>

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
import Form from "~~/components/liste/ListeForm.vue";
import { useListeUpdateStore } from "~~/stores/liste/update";
import { useListeCreateStore } from "~~/stores/liste/create";
import { useListeDeleteStore } from "~~/stores/liste/delete";
import { useMercureItem } from "~~/composables/mercureItem";
import { useFetchItem, useUpdateItem } from "~~/composables/api";
import { SubmissionErrors } from "~~/types/error";
import type { Liste } from "~/models/liste";

const route = useRoute();
const router = useRouter();

const listeCreateStore = useListeCreateStore();
const { created } = storeToRefs(listeCreateStore);

const listeDeleteStore = useListeDeleteStore();
const { error: deleteError, deleted, isLoading: deleteLoading } =
  storeToRefs(listeDeleteStore);

const listeUpdateStore = useListeUpdateStore();

useMercureItem({
  store: listeUpdateStore,
  deleteStore: listeDeleteStore,
  redirectRouteName: "listes",
});

const id = decodeURIComponent(route.params.id as string);
let updated: Ref<Liste | undefined> = ref(undefined);
let violations: Ref<SubmissionErrors | undefined> = ref(undefined);
let {
  retrieved: item,
  error,
  isLoading,
  hubUrl,
} = await useFetchItem<Liste>(`listes/${id}`);
listeUpdateStore.setData({
  retrieved: item,
  error,
  isLoading,
  hubUrl,
});

async function update(payload: Liste) {
  if (!item?.value) {
    listeUpdateStore.setError("No item found. Please reload");
    return;
  }

  const data = await useUpdateItem<Liste>(item.value, payload);
  updated.value = data.updated.value;
  violations.value = data.violations.value;
  isLoading.value = data.isLoading.value;
  error.value = data.error.value;
  listeUpdateStore.setUpdateData(data);
}

async function deleteItem() {
  if (!item?.value) {
    listeDeleteStore.setError("No item found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this liste?")) {
    const { isLoading, error } = await useDeleteItem(item.value);

    if (error.value) {
      listeDeleteStore.setError(error.value);
      return;
    }

    listeDeleteStore.setLoading(Boolean(isLoading?.value));
    listeDeleteStore.setDeleted(item.value);
    listeDeleteStore.setMercureDeleted(undefined);

    if (deleted) {
      router.push({ name: "listes" });
    }
  }
}

onBeforeUnmount(() => {
  listeUpdateStore.$reset();
  listeCreateStore.$reset();
  listeDeleteStore.$reset();
});
</script>
