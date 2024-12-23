import type { User } from "~/models/user"
import { Factory } from "./Factory";

export type TUserCredentials = Pick<User, 'username' | 'password'>

class LoginFactory extends Factory<TUserCredentials> {
    readonly STD_ITEM: TUserCredentials = {
        username: undefined,
        password: undefined
    }

    constructor() {
        super()
        this.setModel(this.STD_ITEM)
    }
}

export default LoginFactory