import InputFactory from "./Input";
import type { TInputWithOptions } from "~/types/factory";


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