<template>
  <form class="py-4" @submit.prevent="emitSubmit">
    <div class="mb-2">
      <label for="liste_guest" class="text-gray-700 block text-sm font-bold capitalize">
        guest
      </label>
      <FormRepeater :values="item.guest" @update="(values: any[]) => (item.guest = values)" />
      <div v-if="violations?.guest" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.guest }}
      </div>
    </div>
    <div class="mb-2">
      <label for="liste_name" class="text-gray-700 block text-sm font-bold capitalize">
        name
      </label>
      <input id="liste_name" v-model="item.name" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.name ? 'border-red-500' : 'border-gray-300',
      ]" type="text" placeholder="" />
      <div v-if="violations?.name" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.name }}
      </div>
    </div>
    <div class="mb-2">
      <label for="liste_owner" class="text-gray-700 block text-sm font-bold capitalize">
        owner
      </label>
      <input id="liste_owner" v-model="item.owner" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.owner ? 'border-red-500' : 'border-gray-300',
      ]" type="text" placeholder="" />
      <div v-if="violations?.owner" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.owner }}
      </div>
    </div>
    <div class="mb-2">
      <label for="liste_type" class="text-gray-700 block text-sm font-bold capitalize">
        type
      </label>
      <input id="liste_type" v-model="item.type" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.type ? 'border-red-500' : 'border-gray-300',
      ]" type="text" placeholder="" />
      <div v-if="violations?.type" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.type }}
      </div>
    </div>
    <div class="mb-2">
      <label for="liste_selectedItems" class="text-gray-700 block text-sm font-bold capitalize">
        selectedItems
      </label>
      <FormRepeater :values="item.selectedItems" @update="(values: any[]) => (item.selectedItems = values)" />
      <div v-if="violations?.selectedItems" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.selectedItems }}
      </div>
    </div>
    <div class="mb-2">
      <label for="liste_items" class="text-gray-700 block text-sm font-bold capitalize">
        items
      </label>
      <FormRepeater :values="item.items" @update="(values: any[]) => (item.items = values)" />
      <div v-if="violations?.items" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.items }}
      </div>
    </div>
    <div class="mb-2">
      <label for="liste_unselectedItems" class="text-gray-700 block text-sm font-bold capitalize">
        unselectedItems
      </label>
      <input id="liste_unselectedItems" v-model="item.unselectedItems" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.unselectedItems ? 'border-red-500' : 'border-gray-300',
      ]" type="text" placeholder="" />
      <div v-if="violations?.unselectedItems" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.unselectedItems }}
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
import type { Liste } from "~/models/liste";
import type { SubmissionErrors } from "~~/types/error";

const props = defineProps<{
  values?: Liste;
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");

let item: Ref<Liste> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
  };
}

let emit = defineEmits<{
  (e: "submit", item: Liste): void;
}>();

function emitSubmit() {
  emit("submit", item.value);
}
</script>
