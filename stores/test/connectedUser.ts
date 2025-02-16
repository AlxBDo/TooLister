import { extendedState } from "~/plugins/pinia/extendsStore/extendedState";
import { defineExtendedStoreId } from "./defineExtendedStoreId";
import { useUserStore, type IUserStore, type TUserState } from "./user";
import type { IPersistedStore, TExtendedStore } from "~/types/store";


export const useConnectedUserStore: TExtendedStore<Partial<IUserStore & IPersistedStore>, TUserState> = defineStore('connectedUserTest', () => {
    const { excludedKeys, isExtended, parentsStores, persist, persistedPropertiesToEncrypt } = extendedState(
        [useUserStore(defineExtendedStoreId('connected', 'user'))],
        {
            isOptionApi: false,
            persist: { persistedPropertiesToEncrypt: ref(['email', 'password', 'username']) }
        }
    )

    function init() {
        if (typeof isExtended === 'object') {
            isExtended.value = false
        }
    }

    return {
        excludedKeys,
        isExtended,
        init,
        parentsStores,
        persist,
        persistedPropertiesToEncrypt
    }

    /**
     * 
    state: (): TUserState => ({
        parentsStores: [useUserStore(defineExtendedStoreId('connected', 'user'))],
        isExtended: false,
    }),

    actions: {
        init() { this.isExtended = false }
    }

    const parentsStores = ref([useUserStore(defineExtendedStoreId('connected', 'user'))])

    const user = computed(() => (state: StateTree) => ({
        email: state.email,
        firstname: state.firstname,
        listes: state.listes,
        password: state.password,
        roles: state.roles,
        sharedLists: state.sharedLists,
        userIdentifier: state.userIdentifier,
        username: state.username
    }))

    return {
        parentsStores,
        user,
        setData: () => undefined
    } as IAnyObject

     * 
     */
})