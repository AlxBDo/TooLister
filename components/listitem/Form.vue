<script setup lang="ts">
import Form from '../form/index.vue'
import ListItemFormManager from '~/managers/ListItemForm'
import type { TListItem } from '~/managers/ListItemForm'
import ListItemManager from '~/managers/ListItem';
import ListItemRepository from '~/repositories/ListItem';
import type { IAnyObject } from '~/types';
import type { PropType } from 'vue'
import type { TListTypes } from '~/types/list';

const listitemProps = defineProps({
    listItem: { type: Object as PropType<TListItem>, required: true },
    listType: { type: String as PropType<TListTypes>, required: true },
    successCallback: Function
})

const htmlClass: IAnyObject = {
    form: "p-6"
}

const listItem = ListItemManager.create(listitemProps.listItem, listitemProps.listType)

const inputs = ref(
    ListItemFormManager.createItemInputs(
        listItem,
        listitemProps.listType
    )
)

async function submit(data: IAnyObject) {
    const { callback } = data
    delete data.callback

    callback && callback()

    data = ListItemFormManager.submiDataFormater(data, listitemProps.listType)

    const dataPromise = listitemProps.listItem.id
        ? ListItemRepository.update(data, listitemProps.listItem)
        : ListItemRepository.insert(data, listitemProps.listType)

    listitemProps.successCallback && listitemProps.successCallback(dataPromise)
}
</script>

<template>
    <Form class="flex flex-wrap justify-between" :inputs :html-class="htmlClass" @submit="submit"></Form>
</template>