<template>
  <form class="py-4" @submit.prevent="emitSubmit">
    <div class="mb-2">
      <label
        for="user_firstname"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        firstname
      </label>
      <input
        id="user_firstname"
        v-model="item.firstname"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.firstname ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder=""
      />
      <div
        v-if="violations?.firstname"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.firstname }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="user_email"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        email
      </label>
      <input
        id="user_email"
        v-model="item.email"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.email ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder=""
      />
      <div
        v-if="violations?.email"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.email }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="user_listes"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        listes
      </label>
      <FormRepeater
        :values="item.listes"
        @update="(values: any[]) => (item.listes = values)"
      />
      <div
        v-if="violations?.listes"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.listes }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="user_password"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        password
      </label>
      <input
        id="user_password"
        v-model="item.password"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.password ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder=""
      />
      <div
        v-if="violations?.password"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.password }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="user_roles"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        roles
      </label>
      <input
        id="user_roles"
        v-model="item.roles"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.roles ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder=""
      />
      <div
        v-if="violations?.roles"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.roles }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="user_sharedLists"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        sharedLists
      </label>
      <FormRepeater
        :values="item.sharedLists"
        @update="(values: any[]) => (item.sharedLists = values)"
      />
      <div
        v-if="violations?.sharedLists"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.sharedLists }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="user_userIdentifier"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        userIdentifier
      </label>
      <input
        id="user_userIdentifier"
        v-model="item.userIdentifier"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.userIdentifier ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder="A visual identifier that represents this user."
      />
      <div
        v-if="violations?.userIdentifier"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.userIdentifier }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="user_username"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        username
      </label>
      <input
        id="user_username"
        v-model="item.username"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.username ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder="Méthode getUsername qui permet de retourner le champ qui est utilisé pour l&#x27;authentification."
      />
      <div
        v-if="violations?.username"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.username }}
      </div>
    </div>
    <div class="mb-2">
      <label
        for="user_salt"
        class="text-gray-700 block text-sm font-bold capitalize"
      >
        salt
      </label>
      <input
        id="user_salt"
        v-model="item.salt"
        :class="[
          'mt-1 w-full px-3 py-2 border rounded',
          violations?.salt ? 'border-red-500' : 'border-gray-300',
        ]"
        type="text"
        placeholder="Returning a salt is only needed, if you are not using a modern
hashing algorithm (e.g. bcrypt or sodium) in your security.yaml."
      />
      <div
        v-if="violations?.salt"
        class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      >
        {{ violations.salt }}
      </div>
    </div>

    <button
      type="submit"
      class="px-6 py-2 bg-green-500 text-white font-medium rounded shadow-md hover:bg-green-600"
    >
      Submit
    </button>
  </form>
</template>

<script lang="ts" setup>
import { Ref } from "vue";
import FormRepeater from "~~/components/common/FormRepeater.vue";
import type { User } from "~~/types/user";
import type { SubmissionErrors } from "~~/types/error";

const props = defineProps<{
  values?: User;
  errors?: SubmissionErrors;
}>();

const violations = toRef(props, "errors");

let item: Ref<User> = ref({});

if (props.values) {
  item.value = {
    ...props.values,
  };
}

let emit = defineEmits<{
  (e: "submit", item: User): void;
}>();

function emitSubmit() {
  emit("submit", item.value);
}
</script>
