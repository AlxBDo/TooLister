<script setup lang="ts">
import type { PropType } from 'vue';
import ItemCard from '../common/ItemCard.vue';
import ListItemRepository from '~/repositories/ListItem';
import type { IItem } from '~/types';
import type { TCardSize } from '../common/ItemCard.vue';
import type { TListItem } from '~/managers/ListItemForm';
import type { TListItemCategory } from '~/models/listitem';

const props = defineProps({
    cardSize: { type: String as PropType<TCardSize>, default: 'normal' },
    editFunction: { type: Function },
    item: { type: Object as PropType<TListItem>, required: true },
    isLoading: { type: Boolean, default: false },
    listType: { type: String, required: true },
    removeItemBtn: { type: Boolean, default: true }
})

const displaySlot = props.cardSize === 'normal'

const emit = defineEmits<{
    (e: 'removeItem', item: TListItem): void
}>()

function deleteFunction(item: TListItem) {
    const deleteItem = { ...item, status: 0 }
    emit('removeItem', deleteItem)
    ListItemRepository.update(deleteItem, item)
}

function displayCategory(category: TListItemCategory) {
    return typeof category === 'object' ? category.name : category;
}


</script>

<template>
    <ItemCard :card-size :edit-function :is-loading :item="(item as IItem)" :remove-item-btn :type="listType"
        @remove-item="deleteFunction">
        <template v-if="displaySlot" #right>
            <div class="w-14 flex-none mr-4 self-center">{{ displayCategory(item?.category ?? '') }}</div>
        </template>
        <template v-if="displaySlot" #main>
            <p v-if="item?.quantity" class="text-sm text-slate-400">
                <span class="text-xs text-slate-500">Qté : </span>{{ item.quantity }}
                <span v-if="item?.quantityUnit">{{ item.quantityUnit }}</span>
            </p>
        </template>
        <template v-if="displaySlot" #bottom-center>
            <div class="flex justify-between flex-wrap text-sm text-slate-300">
                <p v-if="item?.description">{{ item.description }}</p>
                <p v-if="item?.url">{{ item.url }}</p>
            </div>
        </template>
    </ItemCard>
</template>
