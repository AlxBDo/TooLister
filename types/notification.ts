export type TNotificationTypes = "error" | "info" | "success" | "warning";


export interface INotification {
    closable?: boolean;
    delay?: number;
    message: string;
    title?: string;
    type: TNotificationTypes;
}

export interface INotificationOfCollection extends INotification {
    id: string;
}