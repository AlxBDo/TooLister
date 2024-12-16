<script setup lang="ts">
import type { PropType } from 'vue';
import type { TListItem } from '~/managers/ListItemForm';
import { useListItemListStore } from '~/stores/listitem/list';
import type { Liste } from '~/models/liste';
import ListItemCard from './ListItemCard.vue';
import ListItemFormManager from '~/managers/ListItemForm';
import type { IAnyObject } from '~/types';


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
    const itemsByIndex: IAnyObject = {}
    return items.filter(item => {
        const index = item.name?.toLowerCase().indexOf(searchedItem)
        if (index !== undefined && index >= 0) {
            itemsByIndex[item.id ?? 0] = index
            return true
        }
        return false
    }).sort((a: TListItem, b: TListItem) => {
        if (!a.name) {
            return 1
        }
        if (!b.name) {
            return -1
        }

        if (itemsByIndex[a.id ?? 0] === itemsByIndex[b.id ?? 0]) {
            return a.name > b.name ? -1 : 1
        }

        return itemsByIndex[a.id ?? 0] < itemsByIndex[b.id ?? 0] ? -1 : 1
    })
})

const searchValueItem = computed(() => {
    return {
        name: vModel.value,
    }
})


watch(vModel, (value) => {
    display.value = isActive.value
    if (value?.length > 1) {
        if (!display.value) {
            display.value = true
        }
        isLoading.value = true
        perfectMatch.value = undefined

        listItemsStore.searchItems(value, props.list, isLoading, perfectMatch, listItems.value)
    }
})


function isActiveToggle() {
    isActive.value = !isActive.value
}

async function save(item: TListItem) {
    if (saving.value) { return }

    saving.value = true
    try {
        const listItem = { ...item, status: 1, list: `/apip/listes/${props.list?.id}` }
        perfectMatch.value = listItem
        listItemsStore.setItems([listItem])

        const requestResult = await ListItemFormManager.save(
            props.list.type ?? "0",
            listItem,
            item['@id'] ? item : undefined
        )

        requestResult && props.clickItem(toRaw(requestResult.value))

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
            <template v-if="!saving && (isActive || vModel)">
                <ListItemCard v-for="item in listItems" card-size="small" :key="item.id" :list-type="list.type ?? '0'"
                    :item="item" @click="() => save(item)" />
            </template>
            <template v-if="listItemsStore.items">
                <ListItemCard v-for="item in listItemsStore.items" card-size="small" :key="item.id"
                    :list-type="list.type ?? '0'" :is-loading="saving && (item.id === perfectMatch?.id)" :item="item"
                    @click="() => save(item)" />
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