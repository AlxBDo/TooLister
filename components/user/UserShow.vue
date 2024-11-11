<template>
  <div class="flex items-center justify-between">
    <nuxt-link
      :to="{ name: 'users' }"
      class="text-blue-600 hover:text-blue-800"
    >
      &lt; Back to list
    </nuxt-link>

    <div>
      <nuxt-link
        v-if="item"
        :to="{ name: 'users-id-edit', params: { id: getIdFromIri(item['@id']) } }"
        class="px-6 py-2 mr-2 bg-green-600 text-white text-xs rounded shadow-md hover:bg-green-700"
      >
        Edit
      </nuxt-link>
      <button
        class="px-6 py-2 bg-red-600 text-white text-xs rounded shadow-md hover:bg-red-700"
        @click="deleteItem"
      >
        Delete
      </button>
    </div>
  </div>

  <h1 class="text-3xl my-4">Show User {{ item?.["@id"] }}</h1>

  <div
    v-if="isLoading"
    class="bg-blue-100 rounded py-4 px-4 text-blue-700 text-sm"
    role="status"
  >
    Loading...
  </div>

  <div
    v-if="error || deleteError"
    class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
    role="alert"
  >
    {{ error || deleteError }}
  </div>

  <div v-if="item" class="overflow-x-auto">
    <table class="min-w-full">
      <thead class="border-b">
        <tr>
          <th scope="col" class="text-sm font-medium px-6 py-4 text-left">
            Field
          </th>
          <th scope="col" class="text-sm font-medium px-6 py-4 text-left">
            Value
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            firstname
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.firstname }}
                    </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            email
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.email }}
                    </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            listes
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <template v-if="router.hasRoute('listes-id')">
              <nuxt-link
                v-for="liste in item.listes"
                :key="liste"
                :to="{ name: 'listes-id', params: { id: liste } }"
                class="text-blue-600 hover:text-blue-800"
              >
                {{ liste }}

                <br />
              </nuxt-link>
            </template>

            <template v-else>
              <p
                v-for="liste in item.listes"
                :key="liste"
              >
                {{ liste }}
              </p>
            </template>
          </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            password
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.password }}
                    </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            roles
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.roles }}
                    </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            sharedLists
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <template v-if="router.hasRoute('listes-id')">
              <nuxt-link
                v-for="liste in item.listes"
                :key="liste"
                :to="{ name: 'listes-id', params: { id: liste } }"
                class="text-blue-600 hover:text-blue-800"
              >
                {{ liste }}

                <br />
              </nuxt-link>
            </template>

            <template v-else>
              <p
                v-for="liste in item.listes"
                :key="liste"
              >
                {{ liste }}
              </p>
            </template>
          </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            userIdentifier
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.userIdentifier }}
                    </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            username
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.username }}
                    </td>
        </tr>
        <tr class="border-b">
          <th
            class="text-sm font-medium px-6 py-4 text-left capitalize"
            scope="row"
          >
            salt
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.salt }}
                    </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useUserShowStore } from "~~/stores/user/show";
import { useUserDeleteStore } from "~~/stores/user/delete";
import { useMercureItem } from "~~/composables/mercureItem";
import { useFetchItem } from "~~/composables/api";
import { getIdFromIri } from "~~/utils/resource";
import type { User } from "~~/types/user";

const route = useRoute();
const router = useRouter();

const userDeleteStore = useUserDeleteStore();
const { error: deleteError, deleted } = storeToRefs(userDeleteStore);

const userShowStore = useUserShowStore();

useMercureItem({
  store: userShowStore,
  deleteStore: userDeleteStore,
  redirectRouteName: "users",
});

const id = decodeURIComponent(route.params.id as string);
const {
  retrieved: item,
  isLoading,
  error,
  hubUrl,
} = await useFetchItem<User>(`users/${id}`);
userShowStore.setData({ retrieved: item, isLoading, error, hubUrl });

async function deleteItem() {
  if (!item?.value) {
    userDeleteStore.setError("No item found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this user?")) {
    const { error } = await useDeleteItem(item.value);

    if (error.value) {
      userDeleteStore.setError(error.value);
      return;
    }

    userDeleteStore.setDeleted(item.value);
    userDeleteStore.setMercureDeleted(undefined);

    if (deleted) {
      router.push({ name: "users" });
    }
  }
}

onBeforeUnmount(() => {
  userShowStore.$reset();
});
</script>
