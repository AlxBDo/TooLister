<template>
    <div>
        <UserLogin @submit="login" :errors.sync="errorLogin" />
    </div>
</template>

<script lang="ts" setup>
import type { SubmissionErrors } from "~/types/error";
import UserLogin from "~/components/user/UserLogin.vue";
import useConnectedUser from "~/composables/useConnectedUser";

const { login } = useConnectedUser();

const errorLogin = reactive<SubmissionErrors>({});

</script>