<script setup lang="ts">
import type { SubmissionErrors } from "~~/types/error";
import type { LoginSubmitProps } from "~/types/auth";
import { object, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types';
import { passwordValidation, usernameValidation } from "~/utils/validation/user";

const schema = object({
    username: usernameValidation,
    password: passwordValidation
});

type Schema = InferType<typeof schema>;

const props = defineProps<{
    errors?: SubmissionErrors;
}>();

const closeAlert = (errorName: string) => { if (props.errors && props.errors[errorName]) { props.errors[errorName] = ""; } }

const state = reactive({
    btnLoading: false,
    password: undefined,
    username: undefined,
})

const isLoading = computed(() => state.btnLoading && (!props.errors?.form || props.errors?.form.length === 0));

const emit = defineEmits<{
    (e: "submit", data: LoginSubmitProps): void
}>();

if (props.errors) {
    state.btnLoading = false;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    const { username, password } = event.data;
    state.btnLoading = true;
    if (username && password) {
        const callback = () => state.btnLoading = false;
        emit("submit", { username, password, callback });
    }
}
</script>

<template>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UAlert v-if="errors?.form && errors?.form.length > 0" icon="i-material-symbols-error-outline"
            @close="() => closeAlert('form')"
            :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray', variant: 'link', padded: false }"
            color="red" variant="outline" title="Echec de connexion !" :description="errors.form" />
        <UFormGroup label="Email" name="username">
            <UInput :disabled="isLoading" v-model="state.username" />
        </UFormGroup>

        <UFormGroup label="Mot de passe" name="password">
            <UInput :disabled="isLoading" v-model="state.password" type="password" />
        </UFormGroup>

        <UButton :disabled="isLoading" :loading="isLoading" type="submit">
            Connexion
        </UButton>
    </UForm>
</template>