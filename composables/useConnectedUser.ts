import { useUserStore } from "~/stores/user";
import type { LoginSubmitProps } from "~/types/auth";
import useNotification from "./useNotification";
import type { User } from "~/models/user";

export default () => {
    const user = useUserStore();
    user.persistStore();
    const auth = useAuth();
    const notification = useNotification();
    const isPending = ref(false)

    user.$subscribe((mutation, state) => {
        if (mutation.type === 'patch object') {
            // Remember Me
            const password = state.password
            const username = state.username

            if (password && username && !isPending.value && auth.status.value !== 'authenticated') {
                login({ password, username })
            }
        }
    })

    async function login({ callback, password, username }: LoginSubmitProps) {
        try {
            isPending.value = true;
            await auth?.signIn({ password, username }, { callbackUrl: '/', external: false });
            notification.add({ id: "login-success", message: "Récupération de vos données...", title: "Connexion réussie ! ", type: "success", delay: 4000 });
        } catch (e) {
            console.error('login ERROR', e)
        }
        if (auth?.status.value !== "authenticated" && callback) {
            callback("Mail ou mot de passe incorrect 😕");
            notification.add({ id: "login-error", message: "Identifiant ou mot de passe incorrecte.", title: "Echec de connexion ! ", type: "error", delay: 4000 });
        } else {
            update({ password, username })
        }
        isPending.value = false;
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