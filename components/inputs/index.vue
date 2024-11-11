<script setup lang="ts">
import type { IInput, TInput, TInputType } from '~/types/form/input';
import Input from './Input.vue';
import Select from './Select.vue';
import useInput from '~/composables/useInput';


defineProps({
    ...useInput().FORM_GROUP_PROPS,
    ...useInput().SELECT_COMPONENT_PROPS
})

function getInputComponent(inputType: TInputType) {
    if (inputType === 'select') {
        return Select
    }
    return Input
}

const updateEmit = defineEmits<{
    (e: "updateInput", data: IInput): void
}>();

const update = (input: TInput): void => {
    updateEmit('updateInput', input)
}

</script>

<template>
    <UFormGroup :class="htmlClass?.group" eager-validation :description :help :hint :label :name :required :size>
        <component v-if="type" :is="getInputComponent(type)" :class="htmlClass?.input" :color :disabled :icon :id
            :loading :name :options :placeholder :type :ui :value :variant @update-input="update" />
    </UFormGroup>
</template>