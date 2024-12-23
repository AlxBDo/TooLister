<script setup lang="ts">

import { object, type InferType } from 'yup'
import Input from '../inputs/index.vue';

import type { FormErrorEvent, FormSubmitEvent } from '#ui/types';
import type { IInputs } from "~/types/form";
import type { IAnyObject } from "~/types";
import type { TInput } from '~/types/form/input';


const props = defineProps({
    inputs: {
        type: Array as PropType<TInput[]>,
        required: true
    },
    submitButton: {
        type: [Boolean, String],
        default: true
    },
    cancelButton: {
        type: [Boolean, String],
        default: false
    },
    cancelFunction: {
        type: Function as PropType<(event?: Event) => boolean>,
        default: () => true
    },
    htmlClass: {
        type: Object as PropType<IAnyObject>,
        default: () => ({})
    },
    title: { type: String }
})


const form = ref()

const inputs = props.inputs.reduce(
    (acc, curr) => {
        if (Object.keys(curr.validator).length > 0) {
            return {
                schema: { ...acc.schema, [curr.name]: curr.validator },
                state: { ...acc.state, [curr.name]: curr.value }
            }
        }
        return acc
    },
    { schema: {}, state: {} }
) as IInputs


const schema = object(inputs.schema);
type Schema = InferType<typeof schema>;

const state = reactive({
    ...inputs.state,
})

const loading = ref(false)

const updateInput = (input: TInput) => {
    state[input.name] = input.value
}

const emit = defineEmits<{
    (e: "submit", data: IAnyObject): void
}>();

async function onError(event: FormErrorEvent) {
    const element = document.getElementById(event.errors[0].id)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    if (loading.value) { return }

    loading.value = true
    const callback = () => loading.value = false

    emit('submit', { ...event.data, callback })
}

const submitBtn = computed(() => props.submitButton === true ? 'Valider' : props.submitButton)
const cancelBtn = computed(() => props.cancelButton === true ? 'Annuler' : props.cancelButton)
const cancelFunc = computed(() => props.cancelFunction ?? (() => true))
</script>

<template>
    <UForm ref="form" :schema="schema" :state="state" :class="`space-y-4 ${props?.htmlClass?.form}`" @error="onError"
        @submit="onSubmit">
        <h2 v-if="props?.title" :class="`${props?.htmlClass?.title}`">{{ props.title }}</h2>

        <slot name="errors"></slot>

        <slot name="description"></slot>

        <Input v-for="input in props.inputs" v-bind:="input" @update-input="updateInput" />

        <slot></slot>

        <div class="mt-4 w-full flex justify-between">
            <UButton v-if="cancelButton" :class="`${props?.htmlClass?.cancelBtn} mx-auto`" :disabled="loading"
                @click="cancelFunc() && form.clear()">
                {{ cancelBtn }}
            </UButton>
            <UButton v-if="submitButton" :class="`${props?.htmlClass?.submitBtn} mx-auto`" :disabled="loading"
                :loading="loading" type="submit">
                {{ submitBtn }}
            </UButton>
        </div>
    </UForm>
</template>