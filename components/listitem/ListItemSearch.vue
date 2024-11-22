<script setup lang="ts">
import type { PropType } from 'vue';
import type { TListItem } from '~/managers/ListItemForm';
import { useFetchList } from '#imports';
import { useListItemListStore } from '~/stores/listitem/list';
import type { Liste } from '~/models/liste';
import ListItemCard from './ListItemCard.vue';
import ListItemRepository from '~/repositories/ListItem';
import type { TListTypes } from '~/types/list';
import ListItemFormManager from '~/managers/ListItemForm';


const props = defineProps({
    clickItem: { type: Function, required: true },
    list: { type: Object as PropType<Liste>, required: true },
    searchedItem: { type: String }
})


const display = ref(false)

const isActive = ref(false)

const isLoading = ref(false)

const perfectMatch = ref<TListItem>()

const saving = ref(false)

const vModel = ref()


const listItemsStore = useListItemListStore()


const displaySearchValueCard = computed(
    () => vModel?.value?.length > 1 && !perfectMatch.value
)

const listItems = computed(() => {
    if (!vModel?.value) { return props.list.unselectedItems }

    let items: TListItem[] = []
    if (props.list.selectedItems) { items = props.list.selectedItems }
    if (props.list.unselectedItems) { items = [...items, ...props.list.unselectedItems] }

    const searchedItem = vModel.value.toLowerCase()
    return items.filter(item => {
        const index = item.name?.toLowerCase().indexOf(searchedItem)
        return index !== undefined && index >= 0 && index < 3
    })
})

const searchValueItem = computed(() => {
    return {
        name: vModel.value,
    }
})


let pendingRequest: any
watch(vModel, (value) => {
    display.value = isActive.value
    if (value?.length > 1) {
        if (!display.value) {
            display.value = true
        }
        isLoading.value = true
        perfectMatch.value = undefined

        if (pendingRequest) {
            clearTimeout(pendingRequest)
        }

        pendingRequest = setTimeout(() => {
            useFetchList<TListItem[]>(`list_items?name=${value}`).then((listItemsResult) => {
                isLoading.value = false
                if (listItemsResult && listItemsResult.items?.value && !saving.value && vModel.value) {
                    const searched = vModel.value.toLowerCase()
                    const items = ref<TListItem[]>([])
                    items.value = listItemsResult.items.value.reduce((listItems: TListItem[], listItem: TListItem) => {
                        if (!listItems?.find((item: TListItem) => item?.name === listItem.name)) {
                            if (listItem.list !== props.list['@id']) {
                                listItem = { name: listItem.name, '@id': undefined, id: undefined, list: props.list['@id'] }
                            }
                            if (searched === listItem.name?.toLowerCase()) {
                                perfectMatch.value = listItem
                            }
                            listItems.push(listItem)
                        }
                        return listItems
                    }, [])
                    listItemsStore.setData({ ...listItemsResult, items })
                }
            })
        }, 650)

    }
})


function isActiveToggle() {
    isActive.value = !isActive.value
}

async function save(item: TListItem) {
    if (saving.value) { return }

    saving.value = true
    const listType = (props.list.type ?? '0') as TListTypes
    const listItem = { ...ListItemFormManager.submiDataFormater(item, listType), status: 1 }
    perfectMatch.value = listItem
    listItemsStore.setItems([listItem])

    try {
        let requestResult: any
        if (item['@id']) {
            requestResult = await ListItemRepository.update(listItem, item)
        } else {
            requestResult = await ListItemRepository.insert(
                { ...listItem, list: `/apip/listes/${props.list.id}` },
                (props.list.type as TListTypes) ?? '0'
            )
        }

        props.clickItem(toRaw(requestResult.value))

        listItemsStore.$reset()
        perfectMatch.value = undefined
        saving.value = false
        vModel.value = null
        display.value = false
    } catch (e) {
        useConsole().log('Error saving item', [e])
    }
}

</script>

<template>
    <section id="search_item"
        :class="`fixed flex flex-col justify-end max-h-screen right-0 bottom-0 w-full bg-slate-900 bg-opacity-80 p-5 ${isActive && 'h-screen'}`"
        @click.stop="isActiveToggle">
        <div id="result_search_item" class="overflow-y-auto flex flex-wrap justify-center">
            <template v-if="isActive || vModel">
                <ListItemCard v-for="item in listItems" card-size="small" :key="item.id" :list-type="list.type ?? '0'"
                    :is-loading="saving && (item.name === perfectMatch?.name)" :item="item" @click="() => save(item)" />
            </template>
            <template v-if="listItemsStore.items">
                <ListItemCard v-for="item in listItemsStore.items" card-size="small" :key="item.id"
                    :list-type="list.type ?? '0'" :is-loading="saving && (item.name === perfectMatch?.name)"
                    :item="item" @click="() => save(item)" />
            </template>
            <ListItemCard v-if="displaySearchValueCard" card-size="small" :list-type="list.type ?? '0'"
                :item="searchValueItem" @click="() => save(searchValueItem)" />
        </div>
        <div>
            <UInput class="relative z-99" :loading="isLoading" type="text" v-model="vModel"
                @focus="() => !isActive && isActiveToggle" />
        </div>
    </section>
</template>