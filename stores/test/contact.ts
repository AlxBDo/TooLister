import type { Contact } from "~/models/contact"
import { useItemStore } from "./item"
import type { TExtendedState } from "~/types/store";
import type { Item } from "~/models/item"
import { defineExtendedStoreId } from "./defineExtendedStoreId"
import { getParentStorePropertyValue } from "~/plugins/pinia/extendsStore/parentStore"
import { extendedState } from "~/plugins/pinia/extendsStore/extendedState";


export interface IContactStore {
    isPassword: (password: string) => boolean
    modifyPassword: (oldPassword: string, newPassword: string) => void
    setData: (data: TContactState) => void
    contact: Contact
}

export type TContactState = TExtendedState<Item, Contact>

export const useContactStore = (id?: string) => defineStore(id ?? 'contact', {
    state: (): TContactState => ({
        ...extendedState(
            [useItemStore(defineExtendedStoreId(id ?? 'contact', 'item'))],
            { actionsToExtends: ['setData'] }
        ),
        firstname: undefined,
        email: undefined,
        lastname: undefined
    }),

    getters: {
        contact: (state) => ({
            '@id': getParentStorePropertyValue('@id', 0, state.parentsStores),
            id: getParentStorePropertyValue('id', 0, state.parentsStores),
            email: state.email,
            firstname: state.firstname,
            lastname: state?.lastname
        })
    },

    actions: {
        init() {
            this.isExtended = false
        },

        setData(data: TContactState) {
            if (data.email) { this.email = data.email; }
            if (data.firstname) { this.firstname = data.firstname; }
            if (data.lastname) { this.firstname = data.lastname; }
        }
    }
})()