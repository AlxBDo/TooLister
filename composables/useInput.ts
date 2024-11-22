import type { PropType } from "vue"
import type { IOption, TColors, TInputType, TInputValue, TSearchableProps, TVariant } from "~/types/form/input"
import type { TComponentSize } from "~/types"

export default function useInput() {
    const loading: Ref<boolean> = ref(false)
    const optionsRef: Ref<IOption[]> = ref([])
    const vModel: Ref<TInputValue> = ref()


    //-- Functions --\\

    function setOptions(options: IOption[]) {
        if (!options) { options = [] }

        optionsRef.value = options
    }

    function setVModel(value: TInputValue) {
        if (!value) { return }

        vModel.value = value
    }


    //-- Props definitions --\\

    const FORM_GROUP_PROPS = {
        description: String,
        help: String,
        hint: String,
        htmlClass: Object,
        name: String,
        required: { type: Boolean, default: false },
        size: String as PropType<TComponentSize>
    }

    const STD_COMPONENT_PROPS = {
        color: { type: String as PropType<TColors> },
        disabled: Boolean,
        htmlClass: Object,
        icon: String,
        id: String,
        label: String,
        loading: Boolean,
        name: String,
        placeholder: String,
        type: { type: String as PropType<TInputType>, required: true },
        ui: Object,
        variant: String as PropType<TVariant>,
        validator: Object,
        value: [String, Number, Boolean]
    }

    const COMPONENT_WITH_OPTIONS_PROPS = {
        ...STD_COMPONENT_PROPS,
        creatable: { type: Boolean, default: false },
        multiple: { type: Boolean, default: false },
        optionAttribute: { type: String, default: 'label' },
        options: { type: Array as PropType<IOption[]> },
        selectClass: String,
        selectedIcon: String,
        valueAttribute: String
    }

    const SELECT_COMPONENT_PROPS = {
        ...COMPONENT_WITH_OPTIONS_PROPS,
        by: String,
        clearSearchOnClose: { type: Boolean, default: true },
        debounce: { type: Number, default: 300 },
        loadingIcon: String,
        query: String,
        searchable: { type: Function },
        searchAttributes: Array
    }


    return {
        COMPONENT_WITH_OPTIONS_PROPS, FORM_GROUP_PROPS, loading, options: optionsRef, SELECT_COMPONENT_PROPS,
        setOptions, setVModel, STD_COMPONENT_PROPS, vModel
    }
}