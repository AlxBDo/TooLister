import type { IInput, IInputWithOptions, IOption, ISelect, IStdInput, TInput, TInputType, TInputValue } from "~/types/form/input";
import type { IAnyObject } from "~/types";
import { capitalize } from "vue";


export type TStdInput = Omit<IInput, 'name' | 'type'> & { name?: string; type?: string };

export type TInputWithOptions = Omit<IInputWithOptions, 'name' | 'type'> & { name?: string; type?: string };

export type TSelect = Omit<ISelect, 'name' | 'type'> & { name?: string; type?: string };


const inputClass = { xSmall: 'w-1/4', small: 'w-1/3', half: 'w-1/2', large: '2/3', xLarge: 'w-3/4w-', full: 'w-full' }

const logStyle = { bgColor: 'purple', icon: '🌬️' }


export default class InputManager {
    static readonly PROPERTIES: TStdInput = {
        color: undefined,
        description: undefined,
        disabled: false,
        help: undefined,
        hint: undefined,
        icon: undefined,
        label: undefined,
        loading: false,
        name: undefined,
        placeholder: undefined,
        required: false,
        size: undefined,
        type: undefined,
        ui: undefined,
        validator: {},
        value: undefined,
        variant: 'outline'
    }

    static readonly OPTIONS_INPUT_PROPERTIES: TInputWithOptions = {
        ...this.PROPERTIES,
        creatable: false,
        multiple: false,
        options: undefined,
        optionAttribute: 'label',
        selectClass: undefined,
        selectedIcon: undefined,
        valueAttribute: 'value'
    }

    static readonly SELECT_PROPERTIES: TSelect = {
        ...this.OPTIONS_INPUT_PROPERTIES,
        by: undefined,
        clearSearchOnClose: false,
        debounce: 0,
        loadingIcon: undefined,
        query: undefined,
        searchable: undefined,
        searchAttributes: undefined,
        type: 'select'
    }

    private static SPECIFICS_INPUT_PROPERTIES_BY_TYPE: Record<TInputType, IAnyObject> = {
        checkbox: {},
        date: { htmlClass: { group: inputClass.small } },
        number: { htmlClass: { group: inputClass.xSmall } },
        radio: {},
        select: { htmlClass: { group: inputClass.half } },
        text: { htmlClass: { group: inputClass.full } },
        textarea: { htmlClass: { group: inputClass.full } }
    }

    /**
     * 
     * @param {TStdInput} input 
     * @returns {TStdInput} input
     */
    static createInputProperties(input: TStdInput): TStdInput {
        return this.populateInputProperties(input, { ...this.PROPERTIES, type: input.type })
    }

    static createOptions(options: IAnyObject): IOption[] {
        return Object.keys(options).map(key => ({ id: key, label: capitalize(options[key]) }))
    }

    static createOptionsInputProperties(input: TStdInput): TInputWithOptions {
        const inputProperties = this.createInputProperties(input)

        return this.populateOptionsInputProperties(input, inputProperties)
    }

    static createSelectProperties(input: TSelect): TSelect {
        const inputProperties = this.createOptionsInputProperties(input) as TSelect

        if (input.by) { inputProperties.by = input.by }
        if (input.clearSearchOnClose) { inputProperties.clearSearchOnClose = input.clearSearchOnClose }
        if (input.debounce) { inputProperties.debounce = input.debounce }
        if (input.loadingIcon) { inputProperties.loadingIcon = input.loadingIcon }
        if (input.query) { inputProperties.query = input.query }
        if (input.searchable) { inputProperties.searchable = input.searchable }
        if (input.searchAttributes) { inputProperties.searchAttributes = input.searchAttributes }

        return inputProperties
    }

    static createInput(input?: TStdInput, value?: TInputValue): TInput {
        if (!input) { input = { ...this.PROPERTIES } }
        if (value) { input.value = value }
        return input as TInput;
    }

    static createInputs(item: IAnyObject, mappedProperties: IAnyObject, propertiesSorted: string[], excludedProperties: string[] = []): TInput[] {
        const inputs = Object.keys(item).reduce((acc: any, curr: string) => {
            excludedProperties?.push('id')
            if (excludedProperties.includes(curr)) { return acc }

            const input: TStdInput = this.getInputProperties(curr, item, mappedProperties[curr])
            return [...acc, this.createInput(input)]
        }, [])

        return this.sortInputs(inputs, propertiesSorted)
    }

    /**
     * 
     * @param {string} name 
     * @param {IAnyObject} item 
     * @param {IStdInput} mappedProperties 
     * @returns 
     */
    static getInputProperties(name: string, item: IAnyObject, mappedProperties: IStdInput): TInput {
        return {
            ...this.PROPERTIES,
            ...mappedProperties,
            name,
            value: item[name] ?? undefined
        }
    }

    private static populateInputProperties(input: TStdInput, stdInputProperties: TStdInput): TStdInput {
        if (input.color) { stdInputProperties.color = input.color }
        if (input.description) { stdInputProperties.description = input.description }
        if (input.disabled) { stdInputProperties.disabled = input.disabled }
        if (input.help) { stdInputProperties.help = input.help }
        if (input.hint) { stdInputProperties.hint = input.hint }
        if (input.icon) { stdInputProperties.icon = input.icon }
        if (input.label) { stdInputProperties.label = input.label }
        if (input.loading) { stdInputProperties.loading = input.loading }
        if (input.name) { stdInputProperties.name = input.name }
        if (input.placeholder) { stdInputProperties.placeholder = input.placeholder }
        if (input.required) { stdInputProperties.required = input.required }
        if (input.size) { stdInputProperties.size = input.size }
        if (input.type) {
            const type = input.type as TInputType
            stdInputProperties = {
                ...stdInputProperties,
                ...this.SPECIFICS_INPUT_PROPERTIES_BY_TYPE[type],
                type
            }
        }
        if (input.ui) { stdInputProperties.ui = input.ui }
        if (input.validator) { stdInputProperties.validator = input.validator }
        if (input.value) { stdInputProperties.value = input.value }
        if (input.variant) { stdInputProperties.variant = input.variant }

        return stdInputProperties
    }

    private static populateOptionsInputProperties(input: TInputWithOptions, stdInputProperties: TInputWithOptions): TInputWithOptions {
        if (input.creatable) { stdInputProperties.creatable = input.creatable }
        if (input.multiple) { stdInputProperties.multiple = input.multiple }
        if (input.optionAttribute) { stdInputProperties.optionAttribute = input.optionAttribute }
        if (input.options) { stdInputProperties.options = input.options }
        if (input.selectClass) { stdInputProperties.selectClass = input.selectClass }
        if (input.selectedIcon) { stdInputProperties.selectedIcon = input.selectedIcon }
        if (input.valueAttribute) { stdInputProperties.valueAttribute = input.valueAttribute }

        return stdInputProperties
    }

    static sortInputs(inputs: TInput[], propertiesSorted: string[]): TInput[] {
        return inputs.sort(
            (a: TStdInput, b: TStdInput): number => {
                return (a.name && b.name)
                    ? propertiesSorted.indexOf(a.name) - propertiesSorted.indexOf(b.name)
                    : 1
            }
        );
    }

}