import { useNotificationStore } from "~/stores/notification";

export default useNotificationStore
/** 
() => {
    const notificationStore = useNotificationStore()
    const toast = useToast()

    notificationStore.notifications && notificationStore.notifications.forEach(notification => {
        useConsole().log("toast notif", notification)
        toast.add({
            ...notification,
            description: notification.message,
            timeout: notification.delay
        })
    })
    return notificationStore
}
*/