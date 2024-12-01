import type { IInput, IInputWithOptions, IOption, ISelect, TInputValue } from "~/types/form/input";
import type { IAnyObject } from "~/types";
import { capitalize } from "vue";


const logStyle = { bgColor: 'purple', icon: '🌬️' }


export default class InputManager {

    static createOptions(options: IAnyObject): IOption[] {
        return Object.keys(options).map(key => ({ id: key, label: capitalize(options[key]) }))
    }

    static createOptionsFromItems(
        items: IAnyObject[],
        { id = 'id', label = 'name', callback }: { id?: string, label?: string, callback?: Function }
    ): IOption[] {
        return items.map((item: IAnyObject) => {
            callback && callback(item)
            return { id: item[id], label: capitalize(item[label]) }
        })
    }
}