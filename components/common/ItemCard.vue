<script setup lang="ts">
import type { IItem } from '~/types';


export type TCardSize = 'normal' | 'small'


const props = defineProps({
    cardSize: { type: String as PropType<TCardSize>, default: 'normal' },
    editFunction: { type: Function },
    item: { type: Object as PropType<IItem>, required: true },
    isLoading: { type: Boolean, default: false },
    type: { type: String, required: true },
    removeItemBtn: { type: Boolean, default: true }
})


const hasNormalSize = props.cardSize === 'normal'

const hasActionsBtn = hasNormalSize && (props.removeItemBtn || props.editFunction)


const emit = defineEmits<({
    (e: 'removeItem', item: IItem): void
})>()

function removeItem(item: IItem) {
    emit('removeItem', item)
}
</script>

<template>
    <UCard :class="`mb-2 ${!hasNormalSize && 'w-2/5 mr-2'}`" :key="`${type}-${item.id}`">
        <template #default>
            <div :class="`${isLoading && 'opacity-50'}`">
                <div class="flex">
                    <slot v-if="hasNormalSize" name="right"></slot>
                    <div class="flex-auto">
                        <div class="flex justify-between">
                            <h3 class="font-bold">{{ item.name }}</h3>
                            <slot name="main"></slot>
                        </div>

                        <UProgress v-if="isLoading" class="mt-2" size="sm" animation="carousel" />
                        <div v-else>
                            <slot name="bottom-center"></slot>
                        </div>
                    </div>
                    <div v-if="hasActionsBtn && item['@id']" class="flex w-14 self-center ml-5">
                        <UButton v-if="removeItemBtn" alt="delete" color="red" icon="i-mdi:close-thick" square
                            title="Supprimer" variant="ghost" @click.stop.once="() => removeItem(item)" />
                        <UButton v-if="editFunction" :key="`icon-open-modal-form-item-${item?.id}`" icon="i-mdi:pencil"
                            alt="edit" square title="Modifier" variant="ghost"
                            @click.stop="() => editFunction && editFunction()" />
                    </div>
                </div>
            </div>
        </template>
    </UCard>
</template>