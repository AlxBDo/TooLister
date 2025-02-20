import { defineStore } from 'pinia';
import { itemState, persistedState } from '~/utils/store';
import type { User } from "~~/models/user";
import type { IExtendedState, IPersistedState, IPersistedStore, TExtendedStore } from '~/types/store';



export interface IUserStore {
    persistStore: () => void
    stateIsEmpty: () => boolean
    updateUser: (user: User) => void
}

export interface IUserStoreState extends User, IExtendedState { }

export const useUserStore: TExtendedStore<Partial<IUserStore & IPersistedStore>, IUserStoreState> = (id?: string) => defineStore(id ?? 'user', {
    state: (): IUserStoreState => ({
        ...persistedState(false, ['email', 'password', 'username']),
        ...itemState,
        email: undefined,
        firstname: undefined,
        listes: undefined,
        password: undefined,
        roles: undefined,
        salt: undefined,
        userIdentifier: undefined,
        username: undefined
    }),

    actions: {
        init() {
            this.isExtended = false
        },
        persistStore() {
            this.persist = true;
        },

        stateIsEmpty() {
            return !this.id
        },

        updateUser(user: User) {
            if (user['@id']) { this['@id'] = user['@id']; }
            if (user.id) { this.id = user.id; }
            if (user.email) { this.email = user.email; }
            if (user.firstname) { this.firstname = user.firstname; }
            if (user.listes) { this.listes = user.listes; }
            if (user.password) { this.password = user.password; }
            if (user.roles) { this.roles = user.roles; }
            if (user.salt) { this.salt = user.salt; }
            if (user.userIdentifier) { this.userIdentifier = user.userIdentifier; }
            if (user.username) { this.username = user.username; }
        }
    }
})();