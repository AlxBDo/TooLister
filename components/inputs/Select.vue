<script setup lang="ts">
import type { ISelect, IOption } from '~/types/form/input';


const props = defineProps({ ...useInput().SELECT_COMPONENT_PROPS })

const input = useInput()

if (props.options) {
    input.setOptions(props.options)
}

if (props.value) { input.setVModel(props.value) }

const options = input.options

const searchable = props.searchable && searchFunc

const vModel: Ref<any> = input.vModel

const updateEmit = defineEmits<{
    (e: "updateInput", data: ISelect): void
}>();

async function searchFunc(search: string) {
    input.loading.value = true

    const searchOption = { id: search, label: search }
    input.setVModel(search)

    const result = await searchPromise(search)

    input.loading.value = false

    return result.length ? result : [searchOption]
}

async function searchPromise(search: string): Promise<IOption[]> {
    return new Promise<IOption[]>((resolve, reject) => {
        if (props.searchable) {
            resolve(props.searchable(search, input.setVModel))
        } else {
            reject()
        }
    })
}

function update(): void {
    vModel.value && updateEmit('updateInput', {
        ...props as ISelect,
        value: vModel.value.id ?? vModel.value
    })
}

watch(() => vModel.value, update)

</script>

<template>
    <USelectMenu :class="htmlClass?.input" :clear-search-on-close="false" :color :creatable :debounce :disabled :icon
        :id :loading :loading-icon :option-attribute :options="options" :multiple :placeholder :query :search-attributes
        :searchable="searchable" :select-class :selected-icon :type :ui :value-attribute :variant v-model="vModel" />
</template>