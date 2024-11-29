import type { IAnyObject } from "~/types";
import type { Item } from "~/models/item";
import type { TInputType } from "~/types/form/input";
import type { TStdInput } from "~/types/factory";
import InputsFactory from "./Inputs";


const inputClass = { xSmall: 'w-1/4', small: 'w-1/3', half: 'w-1/2', large: '2/3', xLarge: 'w-3/4w-', full: 'w-full' }

const logStyle = { bgColor: 'darkblue', icon: '🏭' }


export default class InputsFromItem<T extends Item> extends InputsFactory<T> {
    protected override _inputsDefinition: IAnyObject = {}

    protected override _sortedProperties?: (keyof T)[] | Record<string, Array<keyof T>> | undefined

    private SPECIFICS_PROPERTIES_BY_TYPE: Record<TInputType, IAnyObject> = {
        checkbox: {},
        date: { htmlClass: { group: inputClass.small } },
        number: { htmlClass: { group: inputClass.xSmall } },
        radio: {},
        select: { htmlClass: { group: inputClass.half } },
        text: { htmlClass: { group: inputClass.full } },
        textarea: { htmlClass: { group: inputClass.full } }
    }

    protected override getInputProperties(properties: TStdInput, name: string): TStdInput {
        if (!properties.type) { throw new Error('Type must be defined'); }

        return { ...properties, ...this.SPECIFICS_PROPERTIES_BY_TYPE[properties.type as TInputType] }
    }
}