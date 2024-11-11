<template>
  <form class="py-4" @submit.prevent="emitSubmit">
    <div class="mb-2">
      <label for="listitem_category" class="text-gray-700 block text-sm font-bold capitalize">
        category
      </label>
      <input id="listitem_category" v-model="item.category" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.category ? 'border-red-500' : 'border-gray-300',
      ]" type="number" placeholder="" />
      <div v-if="violations?.category" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.category }}
      </div>
    </div>
    <div class="mb-2">
      <label for="listitem_description" class="text-gray-700 block text-sm font-bold capitalize">
        description
      </label>
      <input id="listitem_description" v-model="item.description" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.description ? 'border-red-500' : 'border-gray-300',
      ]" type="text" placeholder="" />
      <div v-if="violations?.description" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.description }}
      </div>
    </div>
    <div class="mb-2">
      <label for="listitem_list" class="text-gray-700 block text-sm font-bold capitalize">
        list
      </label>
      <input id="listitem_list" v-model="item.list" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.list ? 'border-red-500' : 'border-gray-300',
      ]" type="text" placeholder="" />
      <div v-if="violations?.list" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.list }}
      </div>
    </div>
    <div class="mb-2">
      <label for="listitem_name" class="text-gray-700 block text-sm font-bold capitalize">
        name
      </label>
      <input id="listitem_name" v-model="item.name" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.name ? 'border-red-500' : 'border-gray-300',
      ]" type="text" placeholder="" />
      <div v-if="violations?.name" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.name }}
      </div>
    </div>
    <div class="mb-2">
      <label for="listitem_status" class="text-gray-700 block text-sm font-bold capitalize">
        status
      </label>
      <input id="listitem_status" v-model="item.status" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.status ? 'border-red-500' : 'border-gray-300',
      ]" type="number" placeholder="" />
      <div v-if="violations?.status" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.status }}
      </div>
    </div>
    <div class="mb-2">
      <label for="listitem_url" class="text-gray-700 block text-sm font-bold capitalize">
        url
      </label>
      <input id="listitem_url" v-model="item.url" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.url ? 'border-red-500' : 'border-gray-300',
      ]" type="text" placeholder="" />
      <div v-if="violations?.url" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.url }}
      </div>
    </div>

    <button type="submit" class="px-6 py-2 bg-green-500 text-white font-medium rounded shadow-md hover:bg-green-600">
      Submit
    </button>
  </form>
</template>

<script lang="ts" setup>
import type { Ref } from "vue";
import type { ListItem } from "~/models/listitem";
import type { SubmissionErrors } from "~~/types/error";

const props = defineProps<{
  values?: ListItem;
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");

let item: Ref<ListItem> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
  };
}

let emit = defineEmits<{
  (e: "submit", item: ListItem): void;
}>();

function emitSubmit() {
  emit("submit", item.value);
}
</script>
