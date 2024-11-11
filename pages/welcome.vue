<script setup lang="ts">
const username = computed(() => useConnectedUser().user?.username)
</script>

<template>
    <main>
        <section v-if="username" id="connected">
            <h1>Bienvenue {{ username }}</h1>
            <p>Connexion en cours...</p>
        </section>
        <section v-else id="not-connected">
            <h1>Bienvenue</h1>
            <p>Avec Listtoo, liste tout !</p>
            <p>
                <NuxtLink to="/auth/login">Connecte toi</NuxtLink>
            </p>
            <p>
                <NuxtLink to="/auth/logup">Pas encore inscris</NuxtLink>
            </p>
        </section>
    </main>
</template>