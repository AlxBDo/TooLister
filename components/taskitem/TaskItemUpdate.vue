<template>
  <div class="flex items-center justify-between">
    <nuxt-link :to="{ name: 'taskitems' }" class="text-blue-600 hover:text-blue-800">
      &lt; Back to list
    </nuxt-link>

    <button class="px-6 py-2 bg-red-600 text-white text-xs rounded shadow-md hover:bg-red-700" @click="deleteItem">
      Delete
    </button>
  </div>

  <h1 class="text-3xl my-4">Edit TaskItem {{ item?.["@id"] }}</h1>

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
import Form from "~~/components/taskitem/TaskItemForm.vue";
import { useTaskItemUpdateStore } from "~~/stores/taskitem/update";
import { useTaskItemCreateStore } from "~~/stores/taskitem/create";
import { useTaskItemDeleteStore } from "~~/stores/taskitem/delete";
import { useMercureItem } from "~~/composables/mercureItem";
import { useFetchItem, useUpdateItem } from "~~/composables/api";
import { SubmissionErrors } from "~~/types/error";
import type { TaskItem } from "~/models/taskitem";

const route = useRoute();
const router = useRouter();

const taskitemCreateStore = useTaskItemCreateStore();
const { created } = storeToRefs(taskitemCreateStore);

const taskitemDeleteStore = useTaskItemDeleteStore();
const { error: deleteError, deleted, isLoading: deleteLoading } =
  storeToRefs(taskitemDeleteStore);

const taskitemUpdateStore = useTaskItemUpdateStore();

useMercureItem({
  store: taskitemUpdateStore,
  deleteStore: taskitemDeleteStore,
  redirectRouteName: "taskitems",
});

const id = decodeURIComponent(route.params.id as string);
let updated: Ref<TaskItem | undefined> = ref(undefined);
let violations: Ref<SubmissionErrors | undefined> = ref(undefined);
let {
  retrieved: item,
  error,
  isLoading,
  hubUrl,
} = await useFetchItem<TaskItem>(`task_items/${id}`);
taskitemUpdateStore.setData({
  retrieved: item,
  error,
  isLoading,
  hubUrl,
});

async function update(payload: TaskItem) {
  if (!item?.value) {
    taskitemUpdateStore.setError("No item found. Please reload");
    return;
  }

  const data = await useUpdateItem<TaskItem>(item.value, payload);
  updated.value = data.updated.value;
  violations.value = data.violations.value;
  isLoading.value = data.isLoading.value;
  error.value = data.error.value;
  taskitemUpdateStore.setUpdateData(data);
}

async function deleteItem() {
  if (!item?.value) {
    taskitemDeleteStore.setError("No item found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this taskitem?")) {
    const { isLoading, error } = await useDeleteItem(item.value);

    if (error.value) {
      taskitemDeleteStore.setError(error.value);
      return;
    }

    taskitemDeleteStore.setLoading(Boolean(isLoading?.value));
    taskitemDeleteStore.setDeleted(item.value);
    taskitemDeleteStore.setMercureDeleted(undefined);

    if (deleted) {
      router.push({ name: "taskitems" });
    }
  }
}

onBeforeUnmount(() => {
  taskitemUpdateStore.$reset();
  taskitemCreateStore.$reset();
  taskitemDeleteStore.$reset();
});
</script>
