import type { Pinia, PiniaPluginContext, StateTree, Store, SubscriptionCallbackMutation } from "pinia";
import type { IAnyObject } from "~/types";
import { areIdentical } from "~/utils/validation/object";
import CRYPT from "~/utils/Crypt";


const logStyleOptions = { bgColor: 'black', icon: '☁️' }


const neverPersist = ['@context', 'activeLink', 'computed', 'dep', 'fn', 'persist', 'persistedPropertiesToEncrypt', 'subs', 'version']


const cryptState = (state: StateTree, Crypt: CRYPT, decrypt: boolean = false): StateTree => {
    if (
        Array.isArray(state.persistedPropertiesToEncrypt) && state.persistedPropertiesToEncrypt.length > 0
        && state.isEncrypted === decrypt
    ) {
        const encryptedState = {} as StateTree

        state.persistedPropertiesToEncrypt.forEach((property: string) => {
            if (state[property]) {
                encryptedState[property] = decrypt ? Crypt.decrypt(state[property]) : Crypt.encrypt(state[property])
            }
        })

        state = { ...state, ...encryptedState, isEncrypted: !decrypt }
    }

    return state
}

function getExcludedKey(state: StateTree): string[] {
    let { excludedKeys } = state

    if (!excludedKeys) {
        excludedKeys = []
    } else if (!Array.isArray(excludedKeys)) {
        excludedKeys = excludedKeys?.value ?? []
    }

    if (!excludedKeys.includes('excludedKeys')) { excludedKeys.push('excludedKeys') }
    if (!excludedKeys.includes('deps')) { excludedKeys = [...excludedKeys, ...neverPersist] }

    return excludedKeys
}

async function persist(state: StateTree, store: IAnyObject, Crypt: CRYPT) {
    if (!state.persist) { return }

    const encrypt = state.hasOwnProperty('persistedPropertiesToEncrypt')
    const storeName = store.hasOwnProperty('getStoreName') ? store.getStoreName() : store.$id
    let persistedState = await usePersister().getItem(storeName)

    useConsole().log(
        `persistStore persist() ${store.$id}`,
        [
            'encrypt', encrypt,
            'store',
            store,
            'persistedState',
            persistedState
        ],
        logStyleOptions
    )

    if (encrypt && persistedState) {
        persistedState = cryptState({ ...state, ...persistedState }, Crypt, true)
    }

    if (!state || (store.stateIsEmpty && store.stateIsEmpty(state))) {
        if (persistedState) {
            store.$patch({ ...toRaw(state), ...persistedState })
        }
    } else {
        if (encrypt) {
            state = cryptState(state, Crypt)
            if (persistedState) { persistedState = cryptState(persistedState, Crypt) }
        }

        const excludedKeys = getExcludedKey(state)

        const newState = populateState(state, persistedState)

        /**
        useConsole().log(
            'persistStore persist',
            [
                'areIdentical',
                areIdentical(newState, persistedState),
                'newState',
                newState,
                'persistedState',
                persistedState,
                'state',
                state
            ],
            logStyleOptions
        )
         */

        if (!areIdentical(newState, persistedState, excludedKeys)) {
            usePersister().setItem(storeName, newState)
        }
    }
}

function populateState(state: StateTree, persistedState?: StateTree) {
    let excludedKeys = getExcludedKey(state)

    const deniedFirstChar = ['_', '$']

    return Object.keys(state).reduce((acc: StateTree, curr: string) => {

        if (!deniedFirstChar.includes(curr[0]) && !excludedKeys.includes(curr)) {

            if (!state[curr] && (persistedState && persistedState[curr])) {
                acc[curr] = persistedState[curr];
            } else {
                if (Array.isArray(state[curr])) {
                    acc[curr] = state[curr].map((item: any) => typeof item === "object" ? populateState(item) : toRaw(item))
                } else if (typeof state[curr] === 'object') {
                    if (state[curr]?.__v_isRef) {
                        acc[curr] = state[curr]?.value
                    } else {
                        acc[curr] = populateState(state[curr], persistedState && persistedState[curr])
                    }
                } else {
                    acc[curr] = toRaw(state[curr])
                }
            }
        }
        return acc
    }, {} as StateTree)
}

export function persistStore(context: PiniaPluginContext) {
    const { store } = context

    useConsole().log(
        `persistStore ${store.$id}`,
        [
            'state', store.$state
        ],
        logStyleOptions
    )

    if (store.$state.hasOwnProperty('persist')) {
        const Crypt = new CRYPT(useRuntimeConfig().public.cryptKey as string, useRuntimeConfig().public.cryptIv as string)
        persist(toRaw(store?.$state), store, Crypt)

        store.$subscribe((mutation: SubscriptionCallbackMutation<StateTree>, state) => {
            if (mutation.type !== 'patch object') {
                persist(toRaw(state), store, Crypt)

                const { newValue, oldValue } = mutation.events as IAnyObject

                if (
                    (typeof newValue === 'object' ? !areIdentical(newValue, oldValue) : newValue !== oldValue)
                    && store.mutationCallback
                ) { store.mutationCallback(mutation) }
            }
        })
    }
}

/**
 */


export default defineNuxtPlugin({
    name: 'persistStore',
    dependsOn: ['extendsPiniaStore'],
    async setup({ $pinia }) {
        ($pinia as Pinia).use(persistStore)
    }
})