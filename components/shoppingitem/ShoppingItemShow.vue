<template>
  <div class="flex items-center justify-between">
    <nuxt-link :to="{ name: 'shoppingitems' }" class="text-blue-600 hover:text-blue-800">
      &lt; Back to list
    </nuxt-link>

    <div>
      <nuxt-link v-if="item" :to="{ name: 'shoppingitems-id-edit', params: { id: getIdFromIri(item['@id']) } }"
        class="px-6 py-2 mr-2 bg-green-600 text-white text-xs rounded shadow-md hover:bg-green-700">
        Edit
      </nuxt-link>
      <button class="px-6 py-2 bg-red-600 text-white text-xs rounded shadow-md hover:bg-red-700" @click="deleteItem">
        Delete
      </button>
    </div>
  </div>

  <h1 class="text-3xl my-4">Show ShoppingItem {{ item?.["@id"] }}</h1>

  <div v-if="isLoading" class="bg-blue-100 rounded py-4 px-4 text-blue-700 text-sm" role="status">
    Loading...
  </div>

  <div v-if="error || deleteError" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm" role="alert">
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
          <th class="text-sm font-medium px-6 py-4 text-left capitalize" scope="row">
            price
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.price }}
          </td>
        </tr>
        <tr class="border-b">
          <th class="text-sm font-medium px-6 py-4 text-left capitalize" scope="row">
            quantity
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.quantity }}
          </td>
        </tr>
        <tr class="border-b">
          <th class="text-sm font-medium px-6 py-4 text-left capitalize" scope="row">
            quantityUnit
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.quantityUnit }}
          </td>
        </tr>
        <tr class="border-b">
          <th class="text-sm font-medium px-6 py-4 text-left capitalize" scope="row">
            category
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.category }}
          </td>
        </tr>
        <tr class="border-b">
          <th class="text-sm font-medium px-6 py-4 text-left capitalize" scope="row">
            description
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.description }}
          </td>
        </tr>
        <tr class="border-b">
          <th class="text-sm font-medium px-6 py-4 text-left capitalize" scope="row">
            list
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <nuxt-link v-if="router.hasRoute('listes-id')" :to="{ name: 'listes-id', params: { id: item.liste } }"
              class="text-blue-600 hover:text-blue-800">
              {{ item.liste }}
            </nuxt-link>

            <p v-else>
              {{ item.liste }}
            </p>
          </td>
        </tr>
        <tr class="border-b">
          <th class="text-sm font-medium px-6 py-4 text-left capitalize" scope="row">
            name
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.name }}
          </td>
        </tr>
        <tr class="border-b">
          <th class="text-sm font-medium px-6 py-4 text-left capitalize" scope="row">
            status
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.status }}
          </td>
        </tr>
        <tr class="border-b">
          <th class="text-sm font-medium px-6 py-4 text-left capitalize" scope="row">
            url
          </th>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            {{ item.url }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useShoppingItemShowStore } from "~~/stores/shoppingitem/show";
import { useShoppingItemDeleteStore } from "~~/stores/shoppingitem/delete";
import { useMercureItem } from "~~/composables/mercureItem";
import { useFetchItem } from "~~/composables/api";
import { getIdFromIri } from "~~/utils/resource";
import type { ShoppingItem } from "~/models/shoppingitem";

const route = useRoute();
const router = useRouter();

const shoppingitemDeleteStore = useShoppingItemDeleteStore();
const { error: deleteError, deleted } = storeToRefs(shoppingitemDeleteStore);

const shoppingitemShowStore = useShoppingItemShowStore();

useMercureItem({
  store: shoppingitemShowStore,
  deleteStore: shoppingitemDeleteStore,
  redirectRouteName: "shoppingitems",
});

const id = decodeURIComponent(route.params.id as string);
const {
  retrieved: item,
  isLoading,
  error,
  hubUrl,
} = await useFetchItem<ShoppingItem>(`shopping_items/${id}`);
shoppingitemShowStore.setData({ retrieved: item, isLoading, error, hubUrl });

async function deleteItem() {
  if (!item?.value) {
    shoppingitemDeleteStore.setError("No item found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this shoppingitem?")) {
    const { error } = await useDeleteItem(item.value);

    if (error.value) {
      shoppingitemDeleteStore.setError(error.value);
      return;
    }

    shoppingitemDeleteStore.setDeleted(item.value);
    shoppingitemDeleteStore.setMercureDeleted(undefined);

    if (deleted) {
      router.push({ name: "shoppingitems" });
    }
  }
}

onBeforeUnmount(() => {
  shoppingitemShowStore.$reset();
});
</script>
