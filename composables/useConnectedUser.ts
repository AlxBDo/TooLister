import { useUserStore, type IUserStore, type IUserStoreState } from "~/stores/user";
import type { LoginSubmitProps } from "~/types/auth";
import useNotification from "./useNotification";
import type { User } from "~/models/user";
import type { IPersistedStore, TStoreExtended } from "~/types/store";
import type { StateTree } from "pinia";

export default () => {
    const user = useUserStore('connectedUser') as TStoreExtended<IUserStore & IPersistedStore, IUserStoreState>
    user.persistStore();
    const auth = useAuth();
    const notification = useNotification();
    const isPending = ref(false)

    !isPending.value && user.remember()

    user.$subscribe(async (mutation, state: StateTree) => {
        if (mutation.type === 'patch object' && Array.isArray(mutation?.events) && mutation.events.length) {
            // Remember Me
            const password = state.password
            const username = state.username


            if (password && username && !isPending.value && auth.status.value !== 'authenticated') {
                isPending.value = true;
                await login({ password, username })
            }
        }
    })

    async function login({ callback, password, username }: LoginSubmitProps) {
        try {
            await auth?.signIn({ password, username }, { callbackUrl: '/', external: false });
            notification.add({ id: "login-success", message: "Récupération de vos données...", title: "Connexion réussie ! ", type: "success", delay: 4000 });
        } catch (e) {
            console.error('login ERROR', e)
        }

        isPending.value = false;

        if (auth?.status.value !== "authenticated" && callback) {
            callback("Mail ou mot de passe incorrect 😕");
            notification.add({ id: "login-error", message: "Identifiant ou mot de passe incorrecte.", title: "Echec de connexion ! ", type: "error", delay: 4000 });
        } else {
            update({ password, username })
        }
    }

    async function logout() {
        try {
            await auth?.signOut({ callbackUrl: '/auth/login', external: false })
        } catch (e) {
            console.error(e)
        }
    }

    function update(userInfo: User) {
        const userData = auth?.data?.value ?? {};
        user?.updateUser({ ...userData, ...userInfo });
    }

    return { login, logout, user }
}