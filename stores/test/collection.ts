import type { Store } from "pinia";
import type { Item } from "~/models/item";
import type { IAnyObject, ISearchParamObject, IStringObject } from "~/types";
import type { AugmentOptionApiStore, IItemListState } from "~/types/store";


export interface CollectionStoreMethods {
    addItem: (item: IAnyObject) => void
    getItem: (criteria: ISearchParamObject & Partial<Item>) => IAnyObject | undefined
    getItems: (criteria?: ISearchParamObject & Partial<Item>) => IAnyObject[]
    removeItem: (item: IAnyObject) => void
    setItems: (items: IAnyObject[]) => void
    updateItem: (updatedItem: IAnyObject, oldItem?: IAnyObject) => void
}

type AugmentingStore = (id: string) => AugmentOptionApiStore<CollectionStoreMethods, IItemListState<IAnyObject>>


export const useCollectionStore: AugmentingStore = (id: string) => defineStore(id, {
    state: (): IItemListState<IAnyObject> => ({
        isLoading: false,
        items: []
    }),

    actions: {
        addItem(item: IAnyObject) {
            let foundedItem: IAnyObject | undefined

            if (item.id || item['@id']) {
                foundedItem = this.getItem(item)
                if (foundedItem) {
                    this.updateItem(item, foundedItem)
                    return
                }
            }

            this.items.push(item)
        },

        getItem(criteria: Partial<IAnyObject>): IAnyObject | undefined {
            return arrayObjectFindBy<IAnyObject>(
                this.items as IAnyObject[],
                criteria as Partial<IAnyObject> & ISearchParamObject
            )
        },

        getItems(criteria?: Partial<IAnyObject>): IAnyObject[] {
            if (!criteria) {
                return this.items
            }

            return arrayObjectFindAllBy<IAnyObject>(
                this.items as IAnyObject[],
                criteria as Partial<IAnyObject> & ISearchParamObject
            )
        },

        removeItem(item: IAnyObject) {
            this.items = this.items.filter((i: IAnyObject) => i.id !== item.id)
        },

        setItems<T extends Item>(items: T[]) {
            if (Array.isArray(items)) {
                this.items = items
            }
        },

        updateItem(updatedItem: IAnyObject, oldItem?: IAnyObject) {
            if (!oldItem) {
                oldItem = this.getItem(updatedItem)
            }

            if (oldItem) {
                Object.assign(oldItem, updatedItem)
            }
        }
    }
})()