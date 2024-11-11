import { defineStore } from 'pinia';
import type { UserPayloadInterface } from '~/types/auth';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        authenticated: false,
        loading: false,
    }),
    actions: {
        async authenticateUser({ username, password }: UserPayloadInterface) {
            const headers = new Headers();
            headers.append('Content-Type', 'application/json')

            const { data, pending }: any = await useFetch('http://127.0.0.1:8741/api/login_check', {
                method: 'post',
                headers,
                body: JSON.stringify({
                    username,
                    password,
                }),
            });
            useConsole().log('authenticateUser', [pending, data?.value?.token]);
            this.loading = pending;
            if (data.value) {
                const token = useCookie('token'); // useCookie new hook in nuxt 3
                token.value = data?.value?.token; // set token to cookie
                this.authenticated = true; // set authenticated  state value to true
            }
        },
        logUserOut() {
            const token = useCookie('token'); // useCookie new hook in nuxt 3
            this.authenticated = false; // set authenticated  state value to false
            token.value = null; // clear the token cookie
        },
    },
});