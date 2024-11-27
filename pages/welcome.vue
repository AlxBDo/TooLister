<script setup lang="ts">
const firstname = computed(() => useConnectedUser().user?.firstname)
</script>

<template>
    <main>
        <section v-if="firstname" id="connected">
            <h1>Bienvenue {{ firstname }}</h1>
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