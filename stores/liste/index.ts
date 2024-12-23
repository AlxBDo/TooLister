import { defineStore } from "pinia";
import type { Liste } from "~/models/liste";
import type { TListItem } from "~/managers/ListItemForm";
import { removeItem, updateItems } from "~/utils/items";
import type { IAnyObject } from "~/types";

export const useListeStore = defineStore("liste", {
    state: (): Liste => ({
        '@id': undefined,
        id: undefined,
        guest: undefined,
        name: undefined,
        owner: undefined,
        type: undefined,
        selectedItems: [],
        items: [],
        unselectedItems: [],
    }),

    actions: {
        addItem(item: TListItem) {
            if (!this.items) { this.items = [] }

            this.items.push(item)

            this.hydrateNewItem(item)
        },

        getListItems(): TListItem[] {
            return [...(this.items ?? []), ...(this.selectedItems ?? []), ...(this.unselectedItems ?? [])]
        },

        hydrateNewItem(item: TListItem) {
            if (item.status === 1) {
                if (!this.selectedItems) { this.selectedItems = [] }

                this.selectedItems.push(item);
            } else {
                if (!this.unselectedItems) { this.unselectedItems = [] }

                this.unselectedItems.push(item);
            }
        },

        saveItem(item: TListItem) {
            const items = this.getListItems()

            if (items.find((i: TListItem) => i['@id'] === item['@id'])) {
                this.updateItems(item)
            } else {
                this.addItem(item)
            }
        },

        searchItem(itemName: string): TListItem[] {
            const itemsByIndex: IAnyObject = {}
            return this.getListItems().filter(item => {
                const index = item.name?.toLowerCase().indexOf(itemName)
                if (index !== undefined && index >= 0) {
                    itemsByIndex[item.id ?? 0] = index
                    return true
                }
                return false
            }).sort((a: TListItem, b: TListItem) => {
                if (!a.name) {
                    return 1
                }
                if (!b.name) {
                    return -1
                }

                if (itemsByIndex[a.id ?? 0] === itemsByIndex[b.id ?? 0]) {
                    return a.name > b.name ? -1 : 1
                }

                return itemsByIndex[a.id ?? 0] < itemsByIndex[b.id ?? 0] ? -1 : 1
            })
        },

        setData(list: Liste) {
            if (list.guest) { this.guest = list.guest }

            if (list["@id"]) { this['@id'] = list["@id"] }

            if (list.id) { this.id = list.id }

            if (list.items) { this.items = list.items }

            if (list.name) { this.name = list.name }

            if (list.owner) { this.owner = list.owner }

            if (list.selectedItems) { this.selectedItems = list.selectedItems }

            if (list.type) { this.type = list.type }

            if (list.unselectedItems) { this.unselectedItems = list.unselectedItems }
        },

        setItems(items: Liste[]) {
            this.items = items
            this.items.forEach((item) => this.hydrateNewItem(item))
        },

        updateItems(updatedItem: TListItem) {
            if (this.items) { this.items = updateItems(updatedItem, this.items) }

            if (updatedItem.status === 1) {
                this.unselectedItems && removeItem(updatedItem, this.unselectedItems);

                if (!this.selectedItems) {
                    this.selectedItems = [updatedItem]
                } else if ((this.selectedItems && !this.selectedItems.find(item => item.id === updatedItem.id))) {
                    this.selectedItems.push(updatedItem)
                } else {
                    this.selectedItems = updateItems(updatedItem, this.selectedItems)
                }
            } else {
                this.selectedItems && removeItem(updatedItem, this.selectedItems)

                if (!this.unselectedItems) {
                    this.unselectedItems = [updatedItem]
                } else {
                    this.unselectedItems = updateItems(updatedItem, this.unselectedItems)
                }
            }
        }
    },
});
