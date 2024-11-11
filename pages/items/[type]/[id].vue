<template>
    <div class="container mx-auto px-4 max-w-2xl mt-4">
        <AsyncComponent :componentPath />
    </div>
</template>

<script lang="ts" setup>
import Update from "~~/components/listitem/ListItemUpdate.vue";
import AsyncComponent from "~/components/common/AsyncComponent.vue";

const route = useRoute();

const type = decodeURIComponent(route.params.type as string);

const componentPath = computed(() => {
    let component;
    switch (type) {
        case "4":
            component = "ShoppingItem";
        default:
            component = "ListItem";
    }
    return `${component.toLowerCase}/${component}Update.vue`;
});
</script>