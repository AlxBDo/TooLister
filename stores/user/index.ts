import { defineStore } from 'pinia';
import type { User } from "~~/models/user";

interface State extends User {
    isEncrypted: boolean;
    persist: boolean;
    persistedPropertiesToEncrypt: string[];
}

export const useUserStore = defineStore('user', {
    state: (): State => ({
        '@id': undefined,
        id: undefined,
        email: undefined,
        firstname: undefined,
        isEncrypted: false,
        listes: undefined,
        password: undefined,
        persist: false,
        persistedPropertiesToEncrypt: ['email', 'password', 'username'],
        roles: undefined,
        salt: undefined,
        userIdentifier: undefined,
        username: undefined
    }),
    actions: {
        clearUser() {
            this['@id'] = undefined;
            this.id = undefined;
            this.email = undefined;
            this.firstname = undefined;
            this.listes = undefined;
            this.password = undefined;
            this.persist = false;
            this.roles = undefined;
            this.salt = undefined;
            this.userIdentifier = undefined;
            this.username = undefined;
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
});