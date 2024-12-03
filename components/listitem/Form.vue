<script setup lang="ts">
import Form from '../form/index.vue'
import ListItemFactory from '~/factories/ListItem';
import ListItemFormManager from '~/managers/ListItemForm'
import ListItemInputsFactory from '~/factories/ListItemInputs';
import type { IAnyObject } from '~/types';
import type { PropType } from 'vue'
import type { TListItem } from '~/managers/ListItemForm'
import type { TListTypes } from '~/types/list';

const listitemProps = defineProps({
    listItem: { type: Object as PropType<TListItem>, required: true },
    listType: { type: String as PropType<TListTypes>, required: true },
    successCallback: Function
})

const htmlClass: IAnyObject = {
    form: "p-6"
}

const listItem = ListItemFactory.create(listitemProps.listType, listitemProps.listItem)

const listItemInputsFactory = new ListItemInputsFactory(listitemProps.listType)

const inputs = ref(
    listItemInputsFactory.create(listItem)
)

async function submit(data: IAnyObject) {
    const { callback } = data
    delete data.callback

    callback && callback()

    const dataPromise = ListItemFormManager.save(listitemProps.listType, data, listitemProps.listItem)

    listitemProps.successCallback && listitemProps.successCallback(dataPromise)
}
</script>

<template>
    <Form class="flex flex-wrap justify-between" :inputs :html-class="htmlClass" @submit="submit"></Form>
</template>