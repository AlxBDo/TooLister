<template>
  <nuxt-link :to="{ name: 'taskitems' }" class="text-blue-600 hover:text-blue-800">
    &lt; Back to list
  </nuxt-link>

  <h1 class="text-3xl my-4">Create TaskItem</h1>

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
import Form from "~~/components/taskitem/TaskItemForm.vue";
import { useTaskItemCreateStore } from "~~/stores/taskitem/create";
import { useCreateItem } from "~~/composables/api";
import { getIdFromIri } from "~~/utils/resource";
import type { TaskItem } from "~/models/taskitem";

const taskitemCreateStore = useTaskItemCreateStore();
const { created, isLoading, violations, error } = storeToRefs(taskitemCreateStore);

async function create(item: TaskItem) {
  const data = await useCreateItem<TaskItem>("task_items", item);
  taskitemCreateStore.setData(data);

  if (!created?.value?.["@id"]) {
    taskitemCreateStore.setError("Missing item id. Please reload");
    return;
  }

  navigateTo({
    name: "taskitems-id-edit",
    params: { id: getIdFromIri(created?.value?.["@id"]) },
  });
}

onBeforeUnmount(() => {
  taskitemCreateStore.$reset();
});
</script>
