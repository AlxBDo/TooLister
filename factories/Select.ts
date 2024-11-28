import OptionsInputFactory from "./OptionsInput";
import type { TSelect } from "~/types/factory";


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