<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
    error: Object as () => NuxtError
})

console.table(props.error);
</script>

<template>
    <div>
        <h1>Oups !</h1>
        <h2>Une erreur est survenue...</h2>
        <p>L'erreur en question : </p>
        <p>{{ error?.statusMessage }}</p>
        <p>{{ error?.message }}</p>
        <NuxtLink to="/">Retour à l'accueil</NuxtLink>
    </div>
</template>