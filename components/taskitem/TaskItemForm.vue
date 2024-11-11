<template>
  <form class="py-4" @submit.prevent="emitSubmit">
    <div class="mb-2">
      <label for="taskitem_dueDate" class="text-gray-700 block text-sm font-bold capitalize">
        dueDate
      </label>
      <input id="taskitem_dueDate" v-model="item.dueDate" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.dueDate ? 'border-red-500' : 'border-gray-300',
      ]" type="date" placeholder="" />
      <div v-if="violations?.dueDate" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.dueDate }}
      </div>
    </div>
    <div class="mb-2">
      <label for="taskitem_startDate" class="text-gray-700 block text-sm font-bold capitalize">
        startDate
      </label>
      <input id="taskitem_startDate" v-model="item.startDate" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.startDate ? 'border-red-500' : 'border-gray-300',
      ]" type="date" placeholder="" />
      <div v-if="violations?.startDate" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.startDate }}
      </div>
    </div>
    <div class="mb-2">
      <label for="taskitem_priority" class="text-gray-700 block text-sm font-bold capitalize">
        priority
      </label>
      <input id="taskitem_priority" v-model="item.priority" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.priority ? 'border-red-500' : 'border-gray-300',
      ]" type="number" placeholder="" />
      <div v-if="violations?.priority" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.priority }}
      </div>
    </div>
    <div class="mb-2">
      <label for="taskitem_duration" class="text-gray-700 block text-sm font-bold capitalize">
        duration
      </label>
      <input id="taskitem_duration" v-model="item.duration" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.duration ? 'border-red-500' : 'border-gray-300',
      ]" type="number" placeholder="" />
      <div v-if="violations?.duration" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.duration }}
      </div>
    </div>
    <div class="mb-2">
      <label for="taskitem_durationType" class="text-gray-700 block text-sm font-bold capitalize">
        durationType
      </label>
      <input id="taskitem_durationType" v-model="item.durationType" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.durationType ? 'border-red-500' : 'border-gray-300',
      ]" type="number" placeholder="" />
      <div v-if="violations?.durationType" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.durationType }}
      </div>
    </div>
    <div class="mb-2">
      <label for="taskitem_category" class="text-gray-700 block text-sm font-bold capitalize">
        category
      </label>
      <input id="taskitem_category" v-model="item.category" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.category ? 'border-red-500' : 'border-gray-300',
      ]" type="number" placeholder="" />
      <div v-if="violations?.category" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.category }}
      </div>
    </div>
    <div class="mb-2">
      <label for="taskitem_description" class="text-gray-700 block text-sm font-bold capitalize">
        description
      </label>
      <input id="taskitem_description" v-model="item.description" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.description ? 'border-red-500' : 'border-gray-300',
      ]" type="text" placeholder="" />
      <div v-if="violations?.description" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.description }}
      </div>
    </div>
    <div class="mb-2">
      <label for="taskitem_list" class="text-gray-700 block text-sm font-bold capitalize">
        list
      </label>
      <input id="taskitem_list" v-model="item.list" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.list ? 'border-red-500' : 'border-gray-300',
      ]" type="text" placeholder="" />
      <div v-if="violations?.list" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.list }}
      </div>
    </div>
    <div class="mb-2">
      <label for="taskitem_name" class="text-gray-700 block text-sm font-bold capitalize">
        name
      </label>
      <input id="taskitem_name" v-model="item.name" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.name ? 'border-red-500' : 'border-gray-300',
      ]" type="text" placeholder="" />
      <div v-if="violations?.name" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.name }}
      </div>
    </div>
    <div class="mb-2">
      <label for="taskitem_status" class="text-gray-700 block text-sm font-bold capitalize">
        status
      </label>
      <input id="taskitem_status" v-model="item.status" :class="[
        'mt-1 w-full px-3 py-2 border rounded',
        violations?.status ? 'border-red-500' : 'border-gray-300',
      ]" type="number" placeholder="" />
      <div v-if="violations?.status" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm">
        {{ violations.status }}
      </div>
    </div>
    <div class="mb-2">
      <label for="taskitem_url" class="text-gray-700 block text-sm font-bold capitalize">
        url
      </label>
      <input id="taskitem_url" v-model="item.url" :class="[
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
import type { TaskItem } from "~/models/taskitem";
import type { SubmissionErrors } from "~~/types/error";

const props = defineProps<{
  values?: TaskItem;
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");

let item: Ref<TaskItem> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
    publicationDate: formatDateInput(props.values.publicationDate),
    publicationDate: formatDateInput(props.values.publicationDate),
  };
}

let emit = defineEmits<{
  (e: "submit", item: TaskItem): void;
}>();

function emitSubmit() {
  emit("submit", item.value);
}
</script>
