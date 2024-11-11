<template>
    <Suspense>
        <template #default>
            <slot></slot>
        </template>
        <template #fallback>
            <div>
                <p v-if="loadingText" class="mb-4 p-2">{{ loadingText }}</p>
                <component :is="Spinner" />
            </div>
        </template>
    </Suspense>
</template>

<script setup lang="ts">
import BallsSpinner from './BallsSpinner.vue';

const props = defineProps({
    loaderComponent: { type: Object },
    loadingText: { type: String }
});

const Spinner = computed(() => props.loaderComponent || BallsSpinner);
</script>
