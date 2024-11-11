<template>
  <form class="py-4" @submit.prevent="emitSubmit">
    <div class="mb-2">
      <label for="giftitem_price" class="text-gray-700 block text-sm font-bold capitalize">
        price
      </label>
      <input id="giftitem_price" v-model="item.price" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.price ? 'border-red-500' : 'border-gray-300',
      ]" type="number" step="0.1" placeholder="" />
      <div v-if="violations?.price" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.price }}
      </div>
    </div>
    <div class="mb-2">
      <label for="giftitem_buyers" class="text-gray-700 block text-sm font-bold capitalize">
        buyers
      </label>
      <FormRepeater :values="item.buyers" @update="(values: any[]) => (item.buyers = values)" />
      <div v-if="violations?.buyers" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.buyers }}
      </div>
    </div>
    <div class="mb-2">
      <label for="giftitem_preferenceOrder" class="text-gray-700 block text-sm font-bold capitalize">
        preferenceOrder
      </label>
      <input id="giftitem_preferenceOrder" v-model="item.preferenceOrder" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.preferenceOrder ? 'border-red-500' : 'border-gray-300',
      ]" type="number" placeholder="" />
      <div v-if="violations?.preferenceOrder" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.preferenceOrder }}
      </div>
    </div>
    <div class="mb-2">
      <label for="giftitem_category" class="text-gray-700 block text-sm font-bold capitalize">
        category
      </label>
      <input id="giftitem_category" v-model="item.category" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.category ? 'border-red-500' : 'border-gray-300',
      ]" type="number" placeholder="" />
      <div v-if="violations?.category" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.category }}
      </div>
    </div>
    <div class="mb-2">
      <label for="giftitem_description" class="text-gray-700 block text-sm font-bold capitalize">
        description
      </label>
      <input id="giftitem_description" v-model="item.description" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.description ? 'border-red-500' : 'border-gray-300',
      ]" type="text" placeholder="" />
      <div v-if="violations?.description" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.description }}
      </div>
    </div>
    <div class="mb-2">
      <label for="giftitem_list" class="text-gray-700 block text-sm font-bold capitalize">
        list
      </label>
      <input id="giftitem_list" v-model="item.list" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.list ? 'border-red-500' : 'border-gray-300',
      ]" type="text" placeholder="" />
      <div v-if="violations?.list" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.list }}
      </div>
    </div>
    <div class="mb-2">
      <label for="giftitem_name" class="text-gray-700 block text-sm font-bold capitalize">
        name
      </label>
      <input id="giftitem_name" v-model="item.name" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.name ? 'border-red-500' : 'border-gray-300',
      ]" type="text" placeholder="" />
      <div v-if="violations?.name" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.name }}
      </div>
    </div>
    <div class="mb-2">
      <label for="giftitem_status" class="text-gray-700 block text-sm font-bold capitalize">
        status
      </label>
      <input id="giftitem_status" v-model="item.status" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.status ? 'border-red-500' : 'border-gray-300',
      ]" type="number" placeholder="" />
      <div v-if="violations?.status" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.status }}
      </div>
    </div>
    <div class="mb-2">
      <label for="giftitem_url" class="text-gray-700 block text-sm font-bold capitalize">
        url
      </label>
      <input id="giftitem_url" v-model="item.url" :class="[
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
import { Ref } from "vue";
import FormRepeater from "~~/components/common/FormRepeater.vue";
import type { GiftItem } from "~/models/giftitem";
import type { SubmissionErrors } from "~~/types/error";

const props = defineProps<{
  values?: GiftItem;
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");

let item: Ref<GiftItem> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
  };
}

let emit = defineEmits<{
  (e: "submit", item: GiftItem): void;
}>();

function emitSubmit() {
  emit("submit", item.value);
}
</script>
