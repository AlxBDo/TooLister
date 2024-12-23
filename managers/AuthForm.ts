import LoginFactory from "~/factories/Login";
import LoginInputsFactory from "~/factories/LoginInputs";
import type { TInput } from "~/types/form/input";


class AuthFormManager {
    getLoginInputs(): TInput[] {
        const loginFactory = new LoginFactory()
        const loginInputs = new LoginInputsFactory()

        return loginInputs.create(
            loginFactory.create()
        )
    }
}

export default new AuthFormManager()