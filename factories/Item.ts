import type { IItem } from "~/types"
import { Factory } from "./Factory"


export type TItem = Omit<IItem, 'id' | 'name'> & { id?: number, name?: string }


export default class ItemFactory extends Factory<TItem> {
    readonly STD_ITEM: TItem = {
        '@id': undefined,
        id: undefined,
        name: undefined,
    }

    constructor() {
        super()
        this.setModel(this.STD_ITEM)
    }
}