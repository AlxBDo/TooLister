import type { Store } from "pinia";
import type { IExtendedState } from "~/types/store";

interface IExtendedStateOptions {
    actionsToExtends?: string[]
    isExtended?: boolean
    isOptionApi?: boolean
    persist?: IPersistOptions
}

export interface IPersistOptions {
    persist?: boolean | Ref<boolean>
    persistedPropertiesToEncrypt?: string[] | Ref<string[]>
    excludedKeys?: string[] | Ref<string[]>,
    isEncrypted?: boolean | Ref<boolean>
}


const defaultExtendedStateOptions: IExtendedStateOptions = {
    actionsToExtends: [],
    isOptionApi: true
}

const defaultPersistEcludedKey = ['actionsToExtends', 'isExtended', 'isOptionApi', 'parentsStores']

const defaultPersistOptionsApi = {
    persist: true,
    persistedPropertiesToEncrypt: [],
    excludedKeys: defaultPersistEcludedKey,
    isEncrypted: false
}

const defaultPersistOptionsSetup = {
    persist: ref(true),
    persistedPropertiesToEncrypt: ref([]),
    excludedKeys: ref(defaultPersistEcludedKey),
    isEncrypted: ref(false)
}


export const extendedState = (
    parentsStores: Store[],
    options?: IExtendedStateOptions

): IExtendedState => {
    let {
        actionsToExtends,
        isExtended,
        isOptionApi,
        persist
    }: IExtendedStateOptions = { ...defaultExtendedStateOptions, ...options }

    if (persist) {
        if (isOptionApi) {
            if (Array.isArray(persist.excludedKeys)) {
                persist.excludedKeys = [...defaultPersistEcludedKey, ...persist.excludedKeys]
            }

            persist = { ...defaultPersistOptionsApi, ...persist }
        } else {
            if (persist.excludedKeys && typeof persist.excludedKeys === 'object') {
                const excludedKeys = !Array.isArray(persist.excludedKeys) ? persist.excludedKeys?.value : []
                persist.excludedKeys = ref([...defaultPersistEcludedKey, ...excludedKeys])
            }

            const defaultPersistOptions = isOptionApi ? defaultPersistOptionsApi : defaultPersistOptionsSetup
            persist = { ...defaultPersistOptions, ...persist }
        }
    }

    return isOptionApi ? ({
        ...persist,
        actionsToExtends,
        isExtended,
        isOptionApi,
        parentsStores
    }) : ({
        ...persist,
        actionsToExtends: ref<string[] | undefined>(actionsToExtends),
        isExtended: ref<boolean | undefined>(isExtended),
        isOptionApi: ref<boolean | undefined>(isOptionApi),
        parentsStores: ref<Store[]>(parentsStores)
    })
}