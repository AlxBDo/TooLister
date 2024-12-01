import type { Router } from "vue-router"

const logStyle = { bgColor: 'darkred', icon: '🧑🏼‍🚒' }

export default defineNuxtPlugin(nuxtApp => {
    const router = nuxtApp.$router as Router

    nuxtApp.hook('app:error', (error) => {
        useConsole().log('errorPlugin app:error', [error], logStyle)
    })

    nuxtApp.hook('vue:error', (err, instance, info) => {
        useConsole().log('errorPlugin vue:error', [err, instance, info, nuxtApp], logStyle)
        router.push({ name: 'error' })
    })
})
