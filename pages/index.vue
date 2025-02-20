<script lang="ts" setup>
import AsyncComponent from '~/components/common/AsyncComponent.vue'
import listFactory from '~/factories/List';
import ModalForm from '~/components/form/ModalForm.vue';
import type { Liste } from '~/models/liste';
import type { Ref } from 'vue';
import type { TModalForm } from '~/composables/useModalForm';
import { useListeListStore, type IListeListState, type IListeListStore } from '~/stores/liste/list';
import useModalForm from '~/composables/useModalForm';
import { useConnectedUserStore } from '~/stores/test/connectedUser';
import type { AugmentOptionApiStore, IItemListState, IPersistedStore, TStoreExtended } from "~/types/store";
import type { IUserStore, TUserState } from '~/stores/test/user';
import { useListsStore } from '~/stores/test/lists';
import type { CollectionStoreMethods } from '~/stores/test/collection';


const connectedUserStore = useConnectedUserStore() as TStoreExtended<IUserStore & IPersistedStore, TUserState>

connectedUserStore.remember()
/** 
connectedUserStore.id = 111

connectedUserStore.setData({ firstname: 'Joe', id: 111, email: 'joe@mail.fr', password: 'mYp@ssw0rd' })

connectedUserStore.persistState()

useConsole().log('connectedUserStore', [connectedUserStore.isPassword('mYp@sswdsdsqd0rd'), connectedUserStore.user, connectedUserStore])

connectedUserStore.modifyPassword('mYp@ssw0rd', 'mYn€wp@sswd0rd')
*/
useConsole().log('connectedUserStore', [connectedUserStore.user])

const listsStore = useListsStore() as TStoreExtended<CollectionStoreMethods, IItemListState<Liste>>

listsStore.addItem({ id: 999, name: 'My first list', type: '0' })

useConsole().log('listsStore', [listsStore.getItems(), listsStore])


const componentPath = 'liste/Listes.vue'

const firstname = computed(() => useConnectedUser()?.user?.firstname)

const formId = 'listeForm'

const listeListStore = useListeListStore() as AugmentOptionApiStore<IListeListStore, IListeListState>

const modalIsOpen = ref<boolean>(false)

const listForm: TModalForm<Liste> = {
  id: formId,
  isOpen: modalIsOpen,
  item: listFactory.create(),
  path: 'liste/Form.vue',
  successCallback: submitFormModal
}

function submitFormModal(data: Promise<Ref<Liste>>) {
  modalToggle()
  if (modalForm?.value) {
    const { item } = modalForm.value
    listeListStore.saveListFromForm(item, data)
  }
}

const { modalForm } = useModalForm<Liste>(listForm)

function modalToggle() {
  modalIsOpen.value = !modalIsOpen.value
  if (modalForm?.value) {
    modalForm.value.isOpen = modalIsOpen.value
  }
}
</script>

<template>
  <main>
    <h2 class="text-lg text-center mb-5">Hello {{ firstname }}</h2>
    <ClientOnly>
      <UContainer>
        <AsyncComponent :component-path loading-text="Chargement de tes listes..." />
        <UButton class="fixed bottom-2 right-2" icon="i-ic-baseline-plus" size="lg" color="primary" square
          :ui="{ rounded: 'rounded-full' }" variant="solid" @click="modalToggle" />
      </UContainer>
    </ClientOnly>
    <ModalForm :id="formId" @close="modalToggle" />
  </main>
</template>