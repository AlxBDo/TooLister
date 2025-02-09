import type { User } from "~/models/user"
import { useItemStore } from "./item"
import type { TExtendedState } from "~/types/store";
import type { Item } from "~/models/item"
import { defineExtendedStoreId } from "./defineExtendedStoreId"
import type { Store } from "pinia";
import type { IAnyObject } from "~/types";
import { getParentStorePropertyValue } from "~/plugins/pinia/extendsStore/parentStore";


export interface IUserStore {
    isPassword: (password: string) => boolean
    modifyPassword: (oldPassword: string, newPassword: string) => void
    setData: (data: TUserState) => void
    user: User
}

export type TUserState = TExtendedState<Item, User>

export const useUserStore = (id?: string) => defineStore(id ?? 'user', {
    state: (): TUserState => ({
        parentsStores: [useItemStore(defineExtendedStoreId(id ?? 'user', 'item'))],
        firstname: undefined,
        email: undefined,
        listes: undefined,
        password: undefined,
        roles: undefined,
        sharedLists: undefined,
        userIdentifier: undefined,
        username: undefined,
        salt: undefined
    }),

    getters: {
        user: (state) => ({
            '@id': state.parentsStores && getParentStorePropertyValue('@id', 0, state.parentsStores),
            id: state.parentsStores && getParentStorePropertyValue('id', 0, state.parentsStores),
            email: state.email,
            firstname: state.firstname,
            listes: state.listes,
            password: state.password,
            roles: state.roles,
            sharedLists: state.sharedLists,
            userIdentifier: state.userIdentifier,
            username: state.username
        })
    },

    actions: {
        init() {
            this.isExtended = false
        },

        isPassword(password: string) {
            return this.password === password
        },

        modifyPassword(oldPassword: string, newPassword: string) {
            if (this.isPassword(oldPassword)) {
                this.password = newPassword
            }
        },

        setData(data: TUserState) {
            if (data.email) { this.email = data.email; }
            if (data.firstname) { this.firstname = data.firstname; }
            if (data.listes) { this.listes = data.listes; }
            if (data.password) { this.password = data.password; }
            if (data.roles) { this.roles = data.roles; }
            if (data.salt) { this.salt = data.salt; }
            if (data.userIdentifier) { this.userIdentifier = data.userIdentifier; }
            if (data.username) { this.username = data.username; }
        }
    }
})()