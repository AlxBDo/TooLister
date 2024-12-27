import type { Liste } from "./liste";
import type { User } from "./user";

export interface ListUserRole {
    list: string | Liste
    name: ListUserRoles
    user: string | User
}

export type ListUserRoles = 'guest' | 'owner' | 'user'