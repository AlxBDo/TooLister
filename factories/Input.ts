import { Factory } from "./Factory";
import type { TStdInput } from "~/types/factory";


const logStyle = { bgColor: 'purple', icon: '🌬️' }


export default class InputFactory extends Factory<TStdInput> {

    readonly STD_PROPERTIES: TStdInput = {
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

    constructor() {
        super();
        this.setModel(this.STD_PROPERTIES)
    }
}