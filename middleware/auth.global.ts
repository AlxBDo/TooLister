import { storeToRefs } from "pinia";
import type { RouteLocationNormalized } from "vue-router";
import { useAuthStore } from "~/stores/auth";
import type { User } from "~/models/user";

const notAuthenticatedPages = ['auth-login', 'auth-logup', 'welcome'];

const pageName = (route: RouteLocationNormalized) => route?.name as string;


export default defineNuxtRouteMiddleware((to, from) => {
    const { authenticated } = storeToRefs(useAuthStore());
    const { data, status } = useAuth();
    if (status.value === "authenticated") {
        authenticated.value = true;
        if (!useConnectedUser()?.user?.firstname && data?.value) {
            const userStore = useConnectedUser().user
            userStore.updateUser(data.value as User);
        }
        if (notAuthenticatedPages.includes(pageName(to))) {
            return navigateTo('/');
        }
    } else if (status.value !== "loading" && !notAuthenticatedPages.includes(pageName(to))) {
        abortNavigation();
        return navigateTo('/welcome');
    }
});