import type { Router } from "vue-router"
import type { INotificationOfCollection } from "~/types/notification"

const logStyle = { bgColor: 'darkred', icon: '🧑🏼‍🚒' }

type baseNotification = Omit<INotificationOfCollection, 'id'>

const errorNotification: baseNotification = {
    message: 'Une erreur est survenue.',
    title: 'Oups !',
    type: 'error'
}

export default defineNuxtPlugin(nuxtApp => {
    const router = nuxtApp.$router as Router

    nuxtApp.hook('app:error', (error) => {
        useConsole().log('errorPlugin app:error', [error], logStyle)
        useNotification().add({
            id: 'app-error',
            ...errorNotification
        })
    })

    nuxtApp.hook('vue:error', (err, instance, info) => {
        useConsole().log('errorPlugin vue:error', [err, instance, info, nuxtApp], logStyle)
        useNotification().add({
            id: 'vue-error',
            ...errorNotification
        })
        router.push({ name: 'error' })
    })
})
