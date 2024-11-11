import type { Pinia, PiniaPluginContext, StateTree } from "pinia";
import type { IAnyObject } from "~/types";
import { areIdentical } from "~/utils/validation/object";
import CRYPT from "~/utils/Crypt";


const logStyleOptions = { bgColor: 'black', icon: '🎈' }


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

async function persist(state: StateTree, store: IAnyObject, Crypt: CRYPT) {
    if (!state.persist) { return }

    const encrypt = state.hasOwnProperty('persistedPropertiesToEncrypt')
    let persistedState = await usePersister().getItem(store.$id);

    if (encrypt && persistedState) {
        persistedState = cryptState(persistedState, Crypt, true)
    }

    /*
    useConsole().log(
        'persistStore persist',
        [
            'areIdentical',
            areIdentical(state, persistedState),
            'state',
            state,
            'persistedState',
            persistedState
        ],
        logStyleOptions
    )
    */

    if (!state || (store.stateIsEmpty && store.stateIsEmpty(state))) {
        persistedState && store.$patch(persistedState)
    } else if (!areIdentical(state, persistedState)) {
        if (encrypt) {
            state = cryptState(state, Crypt)
            if (persistedState) { persistedState = cryptState(persistedState, Crypt) }
        }

        usePersister().setItem(store.$id, populateState(state, persistedState))
    }
}

function populateState(state: StateTree, persistedState?: StateTree) {
    if (!persistedState) { return state }

    return Object.keys(persistedState).reduce((acc: StateTree, curr: string) => {
        if ((!state[curr]) && persistedState[curr]) {
            acc[curr] = persistedState[curr];
        } else {
            acc[curr] = Array.isArray(state[curr]) ? state[curr].map((item: any) => toRaw(item)) : toRaw(state[curr]);
        }
        return acc
    }, {} as StateTree)
}

function PersistPiniaStoreState({ store }: PiniaPluginContext) {
    if (store.$state.hasOwnProperty('persist')) {
        const Crypt = new CRYPT(useRuntimeConfig().public.cryptKey as string, useRuntimeConfig().public.cryptIv as string)
        persist(toRaw(store?.$state), store, Crypt)

        store.$subscribe((mutation, state) => {
            if (mutation.type !== 'patch object') {
                persist(toRaw(state), store, Crypt)
            }
        })
    }
}

export default defineNuxtPlugin(({ $pinia }) => {
    ($pinia as Pinia).use(PersistPiniaStoreState)
})