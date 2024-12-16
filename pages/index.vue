<script lang="ts" setup>
import AsyncComponent from '~/components/common/AsyncComponent.vue'
import listFactory from '~/factories/List';
import ModalForm from '~/components/form/ModalForm.vue';
import type { Liste } from '~/models/liste';
import type { Ref } from 'vue';
import type { TModalForm } from '~/composables/useModalForm';
import { useListeListStore } from '~/stores/liste/list';
import useModalForm from '~/composables/useModalForm';

const componentPath = 'liste/Listes.vue'

const firstname = computed(() => useConnectedUser()?.user?.firstname)

const formId = 'listeForm'

const listeListStore = useListeListStore()

const modalIsOpen = ref<boolean>(false)

const preForm: TModalForm<Liste> = {
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

const { modalForm } = useModalForm<Liste>(preForm)

function modalToggle() {
  modalIsOpen.value = !modalIsOpen.value
  if (modalForm?.value) {
    modalForm.value.isOpen = modalIsOpen.value
  }
}
</script>

<template>
  <main>
    <p class="text-lg text-center mb-5">Hello {{ firstname }}</p>
    <AsyncComponent :component-path loading-text="Chargement de tes listes..." />
    <ModalForm :id="formId" @close="modalToggle" />
    <UButton class="fixed bottom-2 right-2" icon="i-ic-baseline-plus" size="lg" color="primary" square
      :ui="{ rounded: 'rounded-full' }" variant="solid" @click="modalToggle" />
  </main>
</template>