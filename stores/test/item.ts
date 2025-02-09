import type { Item } from "~/models/item";

export interface IItemStore {
    setData: (data: Item) => void
}

export const useItemStore = (id?: string) => defineStore(id ?? 'item', {
    state: (): Item => ({
        "@id": undefined,
        id: undefined,
    }),

    actions: {
        setData(data: Item) {
            if (data['@id']) { this['@id'] = data['@id']; }
            if (data.id) { this.id = data.id; }
        }
    }
})()