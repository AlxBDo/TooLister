import type { Pinia, PiniaPluginContext, StateTree, Store, SubscriptionCallbackMutation } from "pinia";
import type { IAnyObject } from "~/types";
import { areIdentical } from "~/utils/validation/object";
import CRYPT from "~/utils/Crypt";
import { addToState, getStatePropertyValue } from "./augmentPinia/augmentState";
import { isOptionApi } from "./augmentPinia/augmentStore";


const logStyleOptions = { bgColor: 'black', icon: '☁️' }


let crypt: undefined | CRYPT

const neverPersist = ['@context', 'activeLink', 'computed', 'dep', 'fn', 'persist', 'persistedPropertiesToEncrypt', 'subs', 'version']

const storesWatched: string[] = []


/**
 * Adds state's properties and methods necessary for store persistence
 * @param {Store} store 
 */
export function augmentStore({ store }: PiniaPluginContext) {
    const state = store.$state
    const optionApi = isOptionApi({ store } as PiniaPluginContext)

    // Augment state

    if (!state.hasOwnProperty('isEncrypted')) {
        addToState<boolean>('isEncrypted', state, optionApi, false)
    }

    if (!state.hasOwnProperty('persist')) {
        addToState<boolean>('persist', state, optionApi, false)
    }

    if (!state.hasOwnProperty('persistedPropertiesToEncrypt')) {
        addToState<string[]>('persistedPropertiesToEncrypt', state, optionApi, [])
    }

    addToState<string[]>('excludedKeys', state, optionApi, getExcludedKeys(state))


    // Augment Store

    if (!store.persistState) {
        store.persistState = () => persist(state, store)
    }

    if (!store.remember) {
        store.remember = () => remember(store)
    }

    if (!store.watch && !storesWatched.includes(getStoreName(store))) {
        store.watch = () => storeSubscription({ store } as PiniaPluginContext)
    }
}

function cryptState(state: StateTree, decrypt: boolean = false): StateTree {
    const persistedPropertiesToEncrypt = getStatePropertyValue(state.persistedPropertiesToEncrypt)
    const isEncrypted = getStatePropertyValue(state.isEncrypted)

    if (
        Array.isArray(persistedPropertiesToEncrypt) && state.persistedPropertiesToEncrypt.length > 0
        && isEncrypted === decrypt
    ) {
        const Crypt = getCrypt()
        const encryptedState = {} as StateTree

        persistedPropertiesToEncrypt.forEach((property: string) => {
            if (state[property]) {
                encryptedState[property] = decrypt ? Crypt.decrypt(state[property]) : Crypt.encrypt(state[property])
            }
        })

        state = { ...state, ...encryptedState, isEncrypted: !decrypt }
    }

    return state
}

function getCrypt(): CRYPT {
    if (!crypt) {
        crypt = new CRYPT(useRuntimeConfig().public.cryptKey as string, useRuntimeConfig().public.cryptIv as string)
    }

    return crypt
}

function getExcludedKeys(state: StateTree): string[] {
    let { excludedKeys } = state

    if (!excludedKeys) {
        excludedKeys = []
    } else if (!Array.isArray(excludedKeys)) {
        excludedKeys = excludedKeys?.value ?? []
    }

    if (!excludedKeys.includes('excludedKeys')) { excludedKeys.push('excludedKeys') }
    if (!excludedKeys.includes('@context')) { excludedKeys = [...excludedKeys, ...neverPersist] }

    return excludedKeys
}

async function getPersistedState(storeName: string, state?: StateTree): Promise<StateTree | undefined> {
    let persistedState = await usePersister().getItem(storeName)

    if (state && state.hasOwnProperty('persistedPropertiesToEncrypt') && persistedState) {
        persistedState = cryptState({ ...toRaw(state), ...persistedState }, true)
    }

    return persistedState
}

function getStoreName(store: IAnyObject): string {
    return store.hasOwnProperty('getStoreName') ? store.getStoreName() : store.$id
}

async function persist(state: StateTree, store: IAnyObject) {
    const storeName = getStoreName(store)
    let persistedState = await getPersistedState(storeName)

    if (state.hasOwnProperty('persistedPropertiesToEncrypt')) {
        state = cryptState(state)
        if (persistedState) { persistedState = cryptState(persistedState) }
    }

    const newState = populateState(state, persistedState)

    /**
     useConsole().log(
        `persistStore persist ${getStoreName(store)}`,
        [
            'areIdentical',
            areIdentical(newState, persistedState ?? {}, getExcludedKeys(state)),
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

    if (!persistedState || !areIdentical(newState, persistedState, getExcludedKeys(state))) {
        usePersister().setItem(storeName, newState)
    }
}

export function persistStorePlugin(context: PiniaPluginContext) {
    const { store } = context
    const state = store.$state

    if (state && state.hasOwnProperty('persist')) {
        if (state.persist) {
            storeSubscription(context)
        }

        augmentStore(context)
    }
}

function populateState(state: StateTree, persistedState?: StateTree) {
    let excludedKeys = getExcludedKeys(state)

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

async function remember(store: Store) {
    const persistedState = await getPersistedState(getStoreName(store), store.$state)

    if (persistedState) {
        store.$patch(persistedState)
    }
}

function storeSubscription({ store }: PiniaPluginContext) {
    if (storesWatched.includes(getStoreName(store))) {
        return
    }

    storesWatched.push(getStoreName(store))

    store.$subscribe((mutation: SubscriptionCallbackMutation<StateTree>, state) => {
        if (mutation.type !== 'patch object' && mutation?.events) {
            const { newValue, oldValue } = mutation.events as IAnyObject

            persist(toRaw(state), store)

            if (
                (typeof newValue === 'object' ? !areIdentical(newValue, oldValue) : newValue !== oldValue)
                && store.mutationCallback
            ) {
                store.mutationCallback(mutation)
            }
        }
    })
}
