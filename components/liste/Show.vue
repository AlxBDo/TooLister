<script lang="ts" setup>
import type { Liste } from "~/models/liste";
import ListItemManager from "~/managers/ListItem";
import ListItemCard from "../listitem/ListItemCard.vue";
import type { PropType } from "vue";
import type { TListItem } from "~/managers/ListItemForm";
import type { TListTypes } from "~/managers/List";

defineProps({
    editItemFunction: { type: Function, required: true },
    list: { type: Object as PropType<Liste>, required: true },
    pendingItem: { type: Number, default: 0 },
    removeItemBtn: { type: Boolean, default: true }
})

const emit = defineEmits<{
    (e: 'removeItem', item: TListItem): void
}>()

function removeItem(item: TListItem) {
    emit('removeItem', item)
}
</script>

<template>
    <main>
        <h2 class="text-lg text-center -mt-8">{{ list?.name }}</h2>
        <div v-if="list?.selectedItems" class="mt-6 mb-14">
            <ListItemCard v-for="listItem in list.selectedItems" :edit-function="() => editItemFunction(listItem)"
                :is-loading="pendingItem === listItem?.id" :item="listItem"
                :list-type="ListItemManager.getItemType((list.type ?? '0') as TListTypes)" :key="listItem.id"
                :remove-item-btn @remove-item="removeItem">
            </ListItemCard>
        </div>
        <div v-else>
            Aucun élément sélectionné
        </div>
    </main>
</template>