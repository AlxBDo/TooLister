import type { IAnyObject, IItem } from "~/types"

type TItem = Omit<IItem, 'id' | 'name'> & { id?: number, name?: string }

export default class ItemManager {
    static readonly STD_ITEM: TItem = {
        id: undefined,
        name: undefined,
    }

    static getItemProperties(item: IAnyObject) {
        return Object.keys(item).reduce((acc, curr: string) => {
            if (curr.indexOf('@') < 0) { acc = { ...acc, [curr]: item[curr] } }
            return acc
        }, {})
    }
}