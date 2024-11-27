import type { IInput, IInputWithOptions, IOption, ISelect, IStdInput, TInput, TInputType, TInputValue } from "~/types/form/input";
import InputFactory from "./Input";


export type TStdInput = Omit<IInput, 'name' | 'type'> & { name?: string; type?: string };

export type TInputWithOptions = Omit<IInputWithOptions, 'name' | 'type'> & { name?: string; type?: string };

export type TSelect = Omit<ISelect, 'name' | 'type'> & { name?: string; type?: string }

const logStyle = { bgColor: 'purple', icon: '🌬️' }


export default class OptionsInputFactory extends InputFactory {
    readonly OPTIONS_INPUT_PROPERTIES: TInputWithOptions = {
        ...this.STD_PROPERTIES,
        creatable: false,
        multiple: false,
        options: undefined,
        optionAttribute: 'label',
        selectClass: undefined,
        selectedIcon: undefined,
        valueAttribute: 'value'
    }

    constructor() {
        super()
        this.setModel(this.OPTIONS_INPUT_PROPERTIES)
    }
}