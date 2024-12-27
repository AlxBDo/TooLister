<script lang="ts" setup>

import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";

const { authenticated } = storeToRefs(useAuthStore());

const logout = () => {
    usePersister().clear()
    useConnectedUser().logout()
}

</script>

<template>
    <header class="flex items-center justify-between p-3">
        <NuxtLink to="/" class="flex items-center">
            <img src="~/assets/img/TooLister_logo_black_50.png" title="logo" alt="logo" />
            <h1 class="ml-2 text-3xl text-red-400">TooLister</h1>
        </NuxtLink>
        <nav v-if="authenticated">
            <ul>
                <li @click="logout">
                    <UIcon name="i-ic-baseline-logout"></UIcon>
                </li>
            </ul>
        </nav>
    </header>
</template>