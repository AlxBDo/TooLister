import { defineStore } from "pinia";
import type { Liste } from "~/models/liste";
import type { TListItem } from "~/managers/ListItemForm";
import { removeItem, updateItems } from "~/utils/items";

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
            return [...this.items ?? [], this.selectedItems ?? [], this.unselectedItems ?? []]
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
