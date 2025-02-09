import { extendedState } from "~/plugins/pinia/extendsStore/extendedState";
import { defineExtendedStoreId } from "./defineExtendedStoreId";
import { useUserStore, type IUserStore, type TUserState } from "./user";
import type { TExtendedStore } from "~/types/store";


export const useConnectedUserStore: TExtendedStore<Partial<IUserStore>, TUserState> = defineStore('connectedUserTest', () => {
    const { isExtended, parentsStores } = extendedState(
        [useUserStore(defineExtendedStoreId('connected', 'user'))],
        false
    )

    function init() {
        if (typeof isExtended === 'object') {
            isExtended.value = false
        }
    }

    return {
        isExtended,
        init,
        parentsStores
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