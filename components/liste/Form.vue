<script setup lang="ts">
import Form from '../form/index.vue'
import listFactory from '~/factories/List';
import ListRepository from '~/repositories/List';
import type { IAnyObject } from '~/types';
import type { Liste } from '~/models/liste';
import type { PropType } from 'vue'
import ListInputsFactory from '~/factories/ListInputs';


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

const list = listFactory.create(props.item)

const listInpustFactory = new ListInputsFactory()
const inputs = ref(listInpustFactory.create(list))


async function submit(data: IAnyObject) {
    const { callback } = data
    delete data.callback

    emits('pendingItem', data)

    callback && callback()

    const dataPromise = props.item.id
        ? ListRepository.update(data, props.item)
        : ListRepository.insert(data)

    props.successCallback && props.successCallback(dataPromise)
}
</script>

<template>
    <Form :inputs :html-class="htmlClass" @submit="submit"></Form>
</template>