<script setup lang="ts">
import type { TInput } from '~/types/form/input';


const props = defineProps({ ...useInput().STD_COMPONENT_PROPS })

const input = useInput()

if (props.value) { input.setVModel(props.value) }

const vModel: Ref<any> = input.vModel

const updateEmit = defineEmits<{
    (e: "updateInput", data: TInput): void
}>();

const update = (): void => {
    vModel.value && updateEmit('updateInput', {
        ...props as TInput,
        value: vModel.value
    })
}

watch(() => vModel.value, update)

</script>

<template>
    <UInput :class="htmlClass?.input" :color :disabled :icon :id :loading :placeholder :type :ui :variant
        v-model="vModel" />
</template>