const logStyle = { bgColor: 'darkred', icon: '🧑🏼‍🚒' }

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.hook('app:error', (error) => {
        useConsole().log('errorPlugin app:error', [error], logStyle)
    })

    nuxtApp.hook('vue:error', (err, instance, info) => {
        useConsole().log('errorPlugin vue:error', [err, instance, info], logStyle)
    })
})
