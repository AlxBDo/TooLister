<script setup lang="ts">
import type { LoginSubmitProps } from "~/types/auth";
import type { SubmissionErrors } from "~~/types/error";

import AuthFormManager from '~/managers/AuthForm'
import Form from '~/components/form/index.vue'
import type { IAnyObject } from "~/types";


const props = defineProps<{
    errors?: SubmissionErrors;
}>();

const closeAlert = (errorName: string) => { if (props.errors && props.errors[errorName]) { props.errors[errorName] = ""; } }


const emit = defineEmits<{
    (e: "submit", data: LoginSubmitProps): void
}>();

async function onSubmit(data: IAnyObject) {
    const { callback, username, password } = data;
    if (username && password) {
        emit("submit", { username, password, callback });
    }
}
</script>

<template>
    <Form class="my-6" :inputs="AuthFormManager.getLoginInputs()" @submit="onSubmit">
        <template #errors>
            <UAlert v-if="errors?.form && errors?.form.length > 0" icon="i-material-symbols-error-outline"
                @close="() => closeAlert('form')"
                :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray', variant: 'link', padded: false }"
                color="red" variant="outline" title="Echec de connexion !" :description="errors.form" />
        </template>
    </Form>
</template>