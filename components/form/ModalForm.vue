<script lang="ts" setup>
import LazyAsyncComponent from '~/components/common/AsyncComponent.vue'
import useModalForm from '~/composables/useModalForm';
import type { TListItem } from '~/managers/ListItemForm';
import type { Liste } from '~/models/liste';
import type { IAnyObject } from '~/types';


type TUseModalForm = TListItem | Liste


const props = defineProps({
    id: { type: String, required: true }
})

const { getFormProps, modalForm } = useModalForm<TUseModalForm>(props.id)

const emits = defineEmits<({
    (e: 'close'): void,
    (e: 'pending', item: IAnyObject): void
})>()


function closeModal() { emits('close') }

function pendingItem(item: IAnyObject) {
    if (modalForm?.value) {
        modalForm.value.item = item
        modalForm.value.itemIsPending = true
    }
    emits('pending', item)
}
</script>

<template>
    <UModal v-if="modalForm" v-model="modalForm.isOpen">
        <UContainer>
            <UIcon name="i-mdi-close-box" @click="closeModal" class="float-right size-6 block mt-5" />
            <LazyAsyncComponent class="my-12" v-if="modalForm" :component-path="modalForm.path"
                :component-props="getFormProps()" @pending-item="pendingItem" />
        </UContainer>
    </UModal>
</template>