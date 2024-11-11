<script setup lang="ts">
import BallsSpinner from './BallsSpinner.vue';

const props = defineProps({
    componentPath: {
        type: String,
        required: true,
        validator: (value: string) => {
            const regex = /^[a-zA-Z]{3,20}\/[A-Z][a-zA-Z0-9]{1,18}\.vue$/;
            return regex.test(value);
        }
    },
    componentProps: { type: Object },
    loaderComponent: { type: Object },
    loadingText: { type: String }
});

const dynamicComponent = shallowRef();
const isLoading = ref(true)

/* @vite-ignore */
import('../../components/' + props.componentPath).then(component => {
    dynamicComponent.value = component.default
    isLoading.value = false
}).catch(err => {
    console.error('Failed to load component:', err);
})

const Spinner = computed(() => props.loaderComponent || BallsSpinner);
</script>

<template>
    <div v-if="isLoading">
        <p v-if="loadingText" class="mb-4 p-2">{{ loadingText }}</p>
        <component :is="Spinner" />
    </div>
    <component v-else :is="dynamicComponent" v-bind="componentProps" />
</template>
