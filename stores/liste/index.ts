import { defineStore } from "pinia";
import CategoryManager from "~/managers/Category";
import { persistedState } from "~/utils/store";
import { removeItem, updateItems } from "~/utils/items";
import type { IAnyObject } from "~/types";
import type { Liste } from "~/models/liste";
import type { TListItem } from "~/managers/ListItemForm";
import type { IPersistedState } from "~/types/store";

interface State extends Liste, IPersistedState { }

export const useListeStore = defineStore("liste", {
    state: (): State => ({
        ...persistedState(false, undefined, ['guest', 'owner']),
        '@id': undefined,
        id: undefined,
        guest: undefined,
        name: undefined,
        owner: undefined,
        type: undefined,
        selectedItems: [],
        items: [],
        unselectedItems: [],
        usersRole: []
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

        getStoreName() {
            if (this.id) {
                return `list_${this.id}`
            }
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
            if (item.category) {
                item.category = CategoryManager.populateCategory(
                    typeof item.category === 'string' ? { '@id': item.category } : item.category
                )
            }
            const items = this.getListItems()

            const itemFound = items.findIndex((i: TListItem) => i && i['@id'] === item['@id'])
            if (itemFound >= 0) {
                this.updateItems(item, itemFound)
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

            if (list.usersRole) {
                this.usersRole = list.usersRole
            }

            if (list.name) { this.name = list.name }

            if (list.owner) { this.owner = list.owner }

            if (list.selectedItems) { this.selectedItems = list.selectedItems }

            if (list.type) { this.type = list.type }

            if (list.unselectedItems) { this.unselectedItems = list.unselectedItems }

            if (!this.persist) { this.persist = true }
        },

        setItems(items: Liste[]) {
            this.items = items
            this.items.forEach((item) => this.hydrateNewItem(item))
        },

        stateIsEmpty() {
            return (this.id && this.name && this.type) ? false : true
        },

        updateItems(updatedItem: TListItem, itemIndex?: number) {
            if (this.items) {
                if (itemIndex && itemIndex >= 0) {
                    this.items[itemIndex] = updatedItem
                } else {
                    this.items = updateItems(updatedItem, this.items)
                }
            }

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
