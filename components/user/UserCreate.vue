<template>
  <nuxt-link :to="{ name: 'users' }" class="text-blue-600 hover:text-blue-800">
    &lt; Back to list
  </nuxt-link>

  <h1 class="text-3xl my-4">Create User</h1>

  <div
    v-if="isLoading"
    class="bg-blue-100 rounded py-4 px-4 text-blue-700 text-sm"
    role="status"
  >
    Loading...
  </div>

  <div
    v-if="error"
    class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
    role="alert"
  >
    {{ error }}
  </div>

  <Form :errors="violations" @submit="create" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import Form from "~~/components/user/UserForm.vue";
import { useUserCreateStore } from "~~/stores/user/create";
import { useCreateItem } from "~~/composables/api";
import { getIdFromIri } from "~~/utils/resource";
import type { User } from "~~/types/user";

const userCreateStore = useUserCreateStore();
const { created, isLoading, violations, error } = storeToRefs(userCreateStore);

async function create(item: User) {
  const data = await useCreateItem<User>("users", item);
  userCreateStore.setData(data);

  if (!created?.value?.["@id"]) {
    userCreateStore.setError("Missing item id. Please reload");
    return;
  }

  navigateTo({
    name: "users-id-edit",
    params: { id: getIdFromIri(created?.value?.["@id"]) },
  });
}

onBeforeUnmount(() => {
  userCreateStore.$reset();
});
</script>
