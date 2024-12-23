<template>
    <div>
        <LoginForm @submit="login" :errors.sync="errorLogin" />
    </div>
</template>

<script lang="ts" setup>
import type { SubmissionErrors } from "~/types/error";
import LoginForm from "~/components/auth/LoginForm.vue";
import useConnectedUser from "~/composables/useConnectedUser";

const { login } = useConnectedUser();

const errorLogin = reactive<SubmissionErrors>({});

</script>