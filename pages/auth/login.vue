<template>
    <UContainer>
        <LoginForm @submit="login" :errors.sync="errorLogin" />
    </UContainer>
</template>

<script lang="ts" setup>
import type { SubmissionErrors } from "~/types/error";
import LoginForm from "~/components/auth/LoginForm.vue";
import useConnectedUser from "~/composables/useConnectedUser";

const { login } = useConnectedUser();

const errorLogin = reactive<SubmissionErrors>({});

</script>