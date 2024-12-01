<script setup lang="ts">
import Form from '../form/index.vue'
import type { IAnyObject } from '~/types';
import type { Liste } from '~/models/liste';
import type { PropType } from 'vue'
import ListFormManager from '~/managers/ListForm';


const props = defineProps({
    item: { type: Object as PropType<Liste>, required: true },
    successCallback: Function
})

const emits = defineEmits<{
    (e: 'pendingItem', item: Liste): void
}>()


const htmlClass: IAnyObject = {
    form: "p-6"
}


async function submit(data: IAnyObject) {
    const { callback } = data
    delete data.callback

    emits('pendingItem', data)

    callback && callback()

    const dataPromise = ListFormManager.saveList(data, props.item)

    props.successCallback && props.successCallback(dataPromise)
}
</script>

<template>
    <Form :inputs="ListFormManager.getInputsFromItemProps(item)" :html-class="htmlClass" @submit="submit"></Form>
</template>