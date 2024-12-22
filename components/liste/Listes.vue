<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useListeListStore } from "~/stores/liste/list";
import ItemCard from "../common/ItemCard.vue";
import ListManager from "~/managers/List";
import type { Liste } from "~/models/liste";
import type { IItem } from "~/types";
import { mapValueLabelObjects } from "~/utils/object";
import { capitalize } from "vue";


const router = useRouter()

const listeListStore = useListeListStore();

const { isLoading, listsGroupByCategory } = storeToRefs(listeListStore)

listeListStore.getListsGroupByCategory()

const listCatgories = computed(() => {
    return listsGroupByCategory.value && mapValueLabelObjects(
        Object.keys(listsGroupByCategory.value),
        ListManager.TYPE_LABELS, ListManager.TYPE_ICONS
    )
})

const pendingItems = computed(() => listeListStore.pendings ?? [])

function goToList(listId: number) {
    router.push(`listes/${[listId]}`)
}

async function removeItem(list: Liste) {
    if (list.id) {
        listeListStore.deleteItem(list)
    }
}

onBeforeUnmount(() => {
    listeListStore.$reset();
});
</script>

<template>
    <section>
        <h2 class="mb-3 text-lg">Mes listes</h2>
        <div v-if="isLoading && (
            !listsGroupByCategory
            || (typeof listsGroupByCategory === 'object' && !Object.keys(listsGroupByCategory).length))
        ">
            Chargement...
        </div>
        <div class="mt-4" v-else-if="listsGroupByCategory && Array.isArray(listCatgories) && listCatgories.length">
            <UContainer v-for="category in listCatgories">
                <h3 class="flex my-4 items-center">
                    <UIcon v-if="category.icon" :name="category.icon" class="mr-2" />
                    {{ capitalize(category.label) }}
                </h3>
                <div v-if="listsGroupByCategory[category.value] && Array.isArray(listsGroupByCategory[category.value])">
                    <ItemCard v-for="item in listsGroupByCategory[category.value]" class="cursor-pointer" :key="item.id"
                        :item="(item as IItem)" :type="item.type ?? '0'"
                        :is-loading="pendingItems.includes(item.id ?? 0)" @click="() => item.id && goToList(item.id)"
                        @remove-item="removeItem" />
                </div>
            </UContainer>
        </div>
        <div v-else>
            Aucune liste
        </div>
    </section>
</template>