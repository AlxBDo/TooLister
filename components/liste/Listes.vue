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

const groupedLists = await listeListStore.getListsGroupByCategory()

const listCatgories = computed(() => {
    return groupedLists.value && mapValueLabelObjects(
        Object.keys(groupedLists.value),
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
        <div
            v-if="listeListStore.isLoading && (!listCatgories || (!Array.isArray(listCatgories) && !listCatgories.length))">
            Chargement...
        </div>
        <div class="mt-4" v-else-if="Array.isArray(listCatgories) && listCatgories.length">
            <UContainer v-for="category in listCatgories">
                <h3 class="flex my-4 items-center">
                    <UIcon v-if="category.icon" :name="category.icon" class="mr-2" />
                    {{ capitalize(category.label) }}
                </h3>
                <div v-if="groupedLists.value[category.value] && Array.isArray(groupedLists.value[category.value])">
                    <ItemCard v-for="item in groupedLists.value[category.value]" class="cursor-pointer" :key="item.id"
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