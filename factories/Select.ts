import type { IInput, IInputWithOptions, IOption, ISelect, IStdInput, TInput, TInputType, TInputValue } from "~/types/form/input";
import OptionsInputFactory from "./OptionsInput";


export type TStdInput = Omit<IInput, 'name' | 'type'> & { name?: string; type?: string };

export type TInputWithOptions = Omit<IInputWithOptions, 'name' | 'type'> & { name?: string; type?: string };

export type TSelect = Omit<ISelect, 'name' | 'type'> & { name?: string; type?: string }

const logStyle = { bgColor: 'purple', icon: '🌬️' }


export default class SelectFactory extends OptionsInputFactory {
    readonly SELECT_PROPERTIES: TSelect = {
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

    constructor() {
        super()
        this.setModel(this.SELECT_PROPERTIES)
    }
}