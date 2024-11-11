<script setup lang="ts">
import type { TInput, ISelect } from '~/types/form/input';


const props = defineProps({ ...useInput().SELECT_COMPONENT_PROPS })

const input = useInput()

if (props.value) { input.setVModel(props.value) }

const vModel: Ref<any> = input.vModel

const updateEmit = defineEmits<{
    (e: "updateInput", data: TInput): void
}>();

const update = (): void => {
    vModel.value && updateEmit('updateInput', {
        ...props as ISelect,
        value: vModel.value.id
    })
}

watch(() => vModel.value, update)

</script>

<template>
    <USelectMenu :class="htmlClass?.input" :clear-search-on-close :color :creatable :debounce :disabled :icon :id
        :loading :loading-icon :option-attribute :options :multiple :placeholder :query :search-attributes :searchable
        :select-class :selected-icon :type :ui :value-attribute :variant v-model="vModel" />
</template>