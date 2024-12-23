<script setup lang="ts">
import type { PropType } from 'vue';
import type { TListItem } from '~/managers/ListItemForm';
import { useListItemListStore } from '~/stores/listitem/list';
import type { Liste } from '~/models/liste';
import ListItemCard from './ListItemCard.vue';
import { useListeStore } from '~/stores/liste';


const props = defineProps({
    clickItem: { type: Function, required: true },
    list: { type: Object as PropType<Liste>, required: true },
    searchedItem: { type: String }
})


const listItemsStore = useListItemListStore()
const listStore = useListeStore()

listStore.setData(props.list)
listItemsStore.setItems(listStore.unselectedItems as TListItem[])

const { perfectMatch } = storeToRefs(listItemsStore)
const { unselectedItems } = storeToRefs(listStore)

const display = ref(false)

const isActive = ref(false)

const isLoading = ref(false)

const saving = ref(false)

const vModel = ref()



const displaySearchValueCard = computed(
    () => vModel?.value?.length > 1 && !perfectMatch.value
)

const listItems = computed(() => {
    if (!vModel?.value) { return unselectedItems?.value }

    return listStore.searchItem(vModel.value.toLowerCase())
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
    const requestResult = await listItemsStore.save(item, props.list)

    requestResult && props.clickItem(toRaw(requestResult.value))

    saving.value = display.value = false
    vModel.value = null
}

</script>

<template>
    <section id="search_item"
        :class="`fixed flex flex-col justify-end max-h-screen right-0 bottom-0 w-full bg-slate-900 bg-opacity-80 p-5 ${isActive && 'h-screen'}`"
        @click.stop="isActiveToggle">
        <div v-if="isActive || perfectMatch?.id" id="result_search_item"
            class="overflow-y-auto flex flex-wrap justify-center">
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