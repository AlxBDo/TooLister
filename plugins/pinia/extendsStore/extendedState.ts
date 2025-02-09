import type { Store } from "pinia";
import type { IExtendedState } from "~/types/store";


export const extendedState = (
    parentsStores: Store[],
    isOptionApi: boolean = true,
    isExtended?: boolean

): IExtendedState => isOptionApi ? ({
    isExtended,
    isOptionApi,
    parentsStores
}) : ({
    isExtended: ref<boolean | undefined>(isExtended),
    isOptionApi: ref<boolean | undefined>(isOptionApi),
    parentsStores: ref<Store[]>(parentsStores)
})