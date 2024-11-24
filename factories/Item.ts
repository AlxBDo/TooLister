import type { IItem } from "~/types"


export type TItem = Omit<IItem, 'id' | 'name'> & { id?: number, name?: string }


export default class ItemFactory {
    private _item: TItem = {}

    readonly STD_ITEM: TItem = {
        '@id': undefined,
        id: undefined,
        name: undefined,
    }

    constructor() {
        this.setItem(this.STD_ITEM)
    }

    create<T extends TItem>(item?: T): T {
        return this.populateItem({ ...this._item, ...item }) as T
    }

    /**
     * Rewrite this method to make specific process on item creation
     * @param item 
     * @returns 
     */
    protected populateItem(item: TItem): TItem {
        return item
    }

    protected setItem<T extends TItem>(item: T): void {
        this._item = item
    }
}