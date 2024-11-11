<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useDeleteItem } from "~/composables/api";
import { useListeListStore } from "~/stores/liste/list";
import { useFetchList } from "~/composables/api";
import ItemCard from "../common/ItemCard.vue";
import ListManager from "~/managers/List";
import type { Liste } from "~/models/liste";
import type { IItem } from "~/types";
import { arrayObjectGroupBy, mapValueLabelObjects } from "~/utils/object";
import { capitalize } from "vue";


const router = useRouter()

const listeListStore = useListeListStore();

const groupedLists = computed(() => arrayObjectGroupBy(listeListStore.items, 'type'))

const listCatgories = computed(() => {
    return mapValueLabelObjects(Object.keys(groupedLists.value), ListManager.TYPE_LABELS, ListManager.TYPE_ICONS)
})

const pendingItems = computed(() => listeListStore.pendings ?? [])

useFetchList<Liste>(
    `listes?owner=${useConnectedUser().user.id}`
).then((result) => {
    listeListStore.setData(result)
});

function goToList(listId: number) {
    router.push(`listes/${[listId]}`)
}

async function removeItem(list: Liste) {
    if (list.id) {
        listeListStore.removeItem(list.id)
        await useDeleteItem(list)
    }
}


onBeforeUnmount(() => {
    listeListStore.$reset();
});
</script>

<template>
    <section>
        <h2 class="mb-3 text-lg">Mes listes</h2>
        <div v-if="listeListStore.isLoading">Chargement...</div>
        <div class="mt-4" v-else-if="Array.isArray(listCatgories) && listCatgories.length">
            <UContainer v-for="category in listCatgories">
                <h3 class="flex my-4 items-center">
                    <UIcon v-if="category.icon" :name="category.icon" class="mr-2" />
                    {{ capitalize(category.label) }}
                </h3>
                <div v-if="Array.isArray(groupedLists[category.value])">
                    <ItemCard v-for="item in groupedLists[category.value]" class="cursor-pointer" :key="item.id"
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