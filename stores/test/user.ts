import type { User } from "~/models/user"
import type { TExtendedState } from "~/types/store"
import { defineExtendedStoreId } from "./defineExtendedStoreId"
import { getParentStorePropertyValue } from "~/plugins/pinia/extendsStore/parentStore"
import { extendedState } from "~/plugins/pinia/extendsStore/extendedState"
import type { Contact } from "~/models/contact"
import { useContactStore } from "./contact"


export interface IUserStore {
    isPassword: (password: string) => boolean
    modifyPassword: (oldPassword: string, newPassword: string) => void
    setData: (data: TUserState) => void
    user: User
}

export type TUserState = TExtendedState<Contact, User>

export const useUserStore = (id?: string) => defineStore(id ?? 'user', {
    state: (): TUserState => ({
        ...extendedState(
            [useContactStore(defineExtendedStoreId(id ?? 'user', 'contact'))],
            { actionsToExtends: ['setData'] }
        ),
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
            ...getParentStorePropertyValue('contact', 0, state.parentsStores),
            password: state.password,
            roles: state.roles,
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