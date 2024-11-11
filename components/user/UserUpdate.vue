<template>
  <div class="flex items-center justify-between">
    <nuxt-link :to="{ name: 'users' }" class="text-blue-600 hover:text-blue-800">
      &lt; Back to list
    </nuxt-link>

    <button class="px-6 py-2 bg-red-600 text-white text-xs rounded shadow-md hover:bg-red-700" @click="deleteItem">
      Delete
    </button>
  </div>

  <h1 class="text-3xl my-4">Edit User {{ item?.["@id"] }}</h1>

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
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import Form from "~~/components/user/UserForm.vue";
import { useUserUpdateStore } from "~~/stores/user/update";
import { useUserCreateStore } from "~~/stores/user/create";
import { useUserDeleteStore } from "~~/stores/user/delete";
import { useMercureItem } from "~~/composables/mercureItem";
import { useFetchItem, useUpdateItem } from "~~/composables/api";
import type { SubmissionErrors } from "~~/types/error";
import type { User } from "~~/types/user";

const route = useRoute();
const router = useRouter();

const userCreateStore = useUserCreateStore();
const { created } = storeToRefs(userCreateStore);

const userDeleteStore = useUserDeleteStore();
const { error: deleteError, deleted, isLoading: deleteLoading } =
  storeToRefs(userDeleteStore);

const userUpdateStore = useUserUpdateStore();

useMercureItem({
  store: userUpdateStore,
  deleteStore: userDeleteStore,
  redirectRouteName: "users",
});

const id = decodeURIComponent(route.params.id as string);
let updated: Ref<User | undefined> = ref(undefined);
let violations: Ref<SubmissionErrors | undefined> = ref(undefined);
let {
  retrieved: item,
  error,
  isLoading,
  hubUrl,
} = await useFetchItem<User>(`users/${id}`);
userUpdateStore.setData({
  retrieved: item,
  error,
  isLoading,
  hubUrl,
});

async function update(payload: User) {
  if (!item?.value) {
    userUpdateStore.setError("No item found. Please reload");
    return;
  }

  const data = await useUpdateItem<User>(item.value, payload);
  updated.value = data.updated.value;
  violations.value = data.violations.value;
  isLoading.value = data.isLoading.value;
  error.value = data.error.value;
  userUpdateStore.setUpdateData(data);
}

async function deleteItem() {
  if (!item?.value) {
    userDeleteStore.setError("No item found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this user?")) {
    const { isLoading, error } = await useDeleteItem(item.value);

    if (error.value) {
      userDeleteStore.setError(error.value);
      return;
    }

    userDeleteStore.setLoading(Boolean(isLoading?.value));
    userDeleteStore.setDeleted(item.value);
    userDeleteStore.setMercureDeleted(undefined);

    if (deleted) {
      router.push({ name: "users" });
    }
  }
}

onBeforeUnmount(() => {
  userUpdateStore.$reset();
  userCreateStore.$reset();
  userDeleteStore.$reset();
});
</script>
