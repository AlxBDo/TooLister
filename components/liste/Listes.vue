<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useListeListStore, type IListeListState, type IListeListStore } from "~/stores/liste/list";
import ItemCard from "../common/ItemCard.vue";
import ListManager from "~/managers/List";
import type { Liste } from "~/models/liste";
import type { IItem } from "~/types";
import { mapValueLabelObjects } from "~/utils/object";
import { capitalize } from "vue";
import type { AugmentOptionApiStore } from "~/types/store";
import type { ToRefs } from "vue";
import type { _StoreWithGetters, _StoreWithState, PiniaCustomStateProperties } from "pinia";


const router = useRouter()

const listeListStore = useListeListStore() as AugmentOptionApiStore<IListeListStore, IListeListState>;
listeListStore.remember()

type StoreToRefs = PiniaCustomStateProperties<IListeListState>
    & _StoreWithGetters<{ isLoading: boolean, listsGroupByCategory: any }>
    & _StoreWithState<'ListeList', IListeListState, { isLoading: boolean, listsGroupByCategory: any }, IListeListStore>


const { isLoading, listsGroupByCategory } = storeToRefs(listeListStore)
//const isLoading = ref(listeListStore.isLoading)
//const listsGroupByCategory = ref(listeListStore.listsGroupByCategory)

listeListStore.getListsGroupByCategory()

useConsole().log('Listes.vue', [listsGroupByCategory, listeListStore])

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
        <UContainer>
            <p v-if="isLoading && (
                !listsGroupByCategory
                || (typeof listsGroupByCategory === 'object' && !Object.keys(listsGroupByCategory).length))
            ">
                Récupération des listes en cours...
            </p>
            <UAccordion v-else-if="listsGroupByCategory && Array.isArray(listCatgories) && listCatgories.length"
                class="mt-4" color="red" multiple size="lg" variant="outline" :items="listCatgories.map(category => {
                    return {
                        defaultOpen: true,
                        icon: category.icon,
                        label: category.label,
                        slot: `category-${category.value}`
                    }
                })">
                <template v-for="category in listCatgories" #[`category-${category.value}`]>
                    <ItemCard v-for="item in listsGroupByCategory[category.value]" class="cursor-pointer" :key="item.id"
                        :item="(item as IItem)" :type="item.type ?? '0'"
                        :is-loading="pendingItems.includes(item.id ?? 0)" @click="() => item.id && goToList(item.id)"
                        @remove-item="removeItem" />
                </template>
            </UAccordion>
            <p v-else>
                Aucune liste
            </p>
        </UContainer>
    </section>
</template>