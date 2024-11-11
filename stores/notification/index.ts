import { defineStore } from 'pinia';
import type { INotificationOfCollection } from '~/types/notification';


interface State {
    notifications: INotificationOfCollection[]
}

export const useNotificationStore = defineStore("notificationStore", {
    state: (): State => ({ notifications: [] }),
    actions: {
        add(notification: INotificationOfCollection): void {
            const toast = useToast()
            toast.add({
                ...notification,
                description: notification.message,
                timeout: notification.delay
            })
            //this.notifications.push(notification);
            //notification.delay && setTimeout(() => this.remove(notification), notification.delay)
        },
        remove(notification: INotificationOfCollection): void {
            this.notifications = this.notifications.filter((n: INotificationOfCollection) => n.id !== notification.id);
        }
    }
})