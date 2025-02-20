import type { PiniaPluginContext, StateTree, Store } from "pinia";
import type { IAnyObject } from "~/types";
import { addPropertiesToState } from "../augmentPinia/augmentState";
import { augmentStore } from "../persistStore";
import { isOptionApi } from "../augmentPinia/augmentStore";
import type { IPersistedState, IPersistedStore, TStoreExtended } from "~/types/store";


const logStyleOptions = { bgColor: 'green', icon: '☁️' }


const extendedActions = ['watch']

/**
 * Create computed function to extend store property
 * @param {IAnyObject} store 
 * @param {string} key 
 * @returns computed function
 */
function createComputed(store: IAnyObject, key: string) {
    return computed({
        get: () => {
            return store[key]
        },
        set: (value: any) => {
            store[key] = value
        }
    })
}

/**
 * Extends storeToExtend's action to extendedStore
 * @param {IAnyObject} storeToExtend 
 * @param {IAnyObject} extendedStore 
 * @param {string} key 
 */
function extendsAction(storeToExtend: IAnyObject, extendedStore: IAnyObject, key: string): void {
    const originalFunction = extendedStore[key];

    if (extendedStore.$state.isOptionApi) {
        extendedStore[key] = function (...args: any[]) {
            storeToExtend[key].apply(this, args);
            originalFunction.apply(this, args);
        }
    } else {
        extendedStore[key] = (...args: any[]) => {
            storeToExtend[key](...args);
            originalFunction(...args);
        }
    }
}

/**
 * Duplicates storeToExtend to extendedStore
 * @param {IAnyObject} storeToExtend 
 * @param {IAnyObject} extendedStore 
 */
function duplicateStore(storeToExtend: IAnyObject, extendedStore: IAnyObject): void {
    const deniedFirstChars = ['$', '_']

    Object.keys(storeToExtend).forEach((key: string) => {
        if (deniedFirstChars.includes(key[0])) { return }

        const typeOfProperty = typeof storeToExtend[key]

        if (typeOfProperty === 'function') {
            if (
                extendedStore.hasOwnProperty(key) && (
                    extendedActions.includes(key) || (
                        extendedStore?.actionsToExtends &&
                        extendedStore?.actionsToExtends.includes(key)
                    )
                )
            ) {
                extendsAction(storeToExtend, extendedStore, key)
            } else {
                extendedStore[key] = storeToExtend[key];
            }
        } else if (
            !extendedStore.hasOwnProperty(key) &&
            (typeOfProperty === 'undefined' || typeOfProperty === 'object')
        ) {
            extendedStore[key] = createComputed(storeToExtend, key)
        }
    })
}

/**
 * Create “computed” in extendedStore to extend state properties of storeToExtend
 * @param {IAnyObject} storeToExtend 
 * @param {IAnyObject} extendedStore 
 */
function extendsStateToComputed(storeToExtend: IAnyObject, extendedStore: IAnyObject) {
    Object.keys(storeToExtend.$state).forEach((key: string) => {
        if (!extendedStore.$state.hasOwnProperty(key)) {
            extendedStore[key] = createComputed(storeToExtend.$state, key)
        }
    })
}

/**
 * Extends to store stores list in parentsStores property
 * @param {PiniaPluginContext} context 
 */
export function extendsStore({ store }: PiniaPluginContext): void {
    if (store.$state.hasOwnProperty('parentsStores')) {
        const storeToExtend: Store[] = store.$state.parentsStores

        if (!storeToExtend || !storeToExtend.length) { return }

        storeToExtend.forEach((ste: Store) => {
            if (store.$state.hasOwnProperty('persist')) {
                store.$state.parentsStores.forEach((parentStore: Store) => {
                    if (!parentStore.$state.hasOwnProperty('persist')) {
                        persistChildStore({ store: parentStore } as PiniaPluginContext, store.$state)
                    }
                })
            }

            duplicateStore(ste, store)
            extendsStateToComputed(ste, store)
        })

        store.$state.isExtended = true
    }
}

/**
 * Add state properties necessary to persist
 * @param {StateTree} state 
 * @param {StateTree} childStoreState 
 */
function persistChildStore({ store }: PiniaPluginContext, childStoreState: StateTree) {
    const state = store.$state
    state.persist = true

    addPropertiesToState(
        ['persistedPropertiesToEncrypt', 'excludedKeys'],
        state,
        isOptionApi({ store } as PiniaPluginContext),
        childStoreState
    )

    augmentStore({ store } as PiniaPluginContext)

    runPersist(store as TStoreExtended<IPersistedStore, IPersistedState>)

    if (store.$state.hasOwnProperty('parentsStores')) {
        store.$state.parentsStores.forEach((parentStore: Store) => persistChildStore(
            { store: parentStore } as PiniaPluginContext, store.$state
        ))
    }
}

function runPersist(store: TStoreExtended<IPersistedStore, IPersistedState>) {
    store.remember()
    store.watch && store.watch()
}