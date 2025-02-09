<script setup lang="ts">
const firstname = computed(() => useConnectedUser().user?.firstname)
const password = computed(() => useConnectedUser().user?.password)
</script>

<template>
    <main>
        <h1 class="my-6 text-center text-2xl">Bienvenue {{ firstname }}</h1>
        <UContainer>
            <p v-if="firstname && password">Connexion en cours...</p>
            <div v-else id="not-connected">
                <p class="mb-4">Avec TooLister, liste tout !</p>
                <p class="mb-4">
                    <span class="mr-2">Déjà un compte ?</span>
                    <NuxtLink to="/auth/login">Connecte toi</NuxtLink>
                </p>
                <p class="mb-4">
                    <NuxtLink to="/auth/logup">Pas encore inscris !</NuxtLink>
                </p>
            </div>
        </UContainer>
    </main>
</template>