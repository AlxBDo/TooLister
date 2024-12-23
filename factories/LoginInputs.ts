import InputsFactory from "./Inputs"
import { passwordValidation, usernameValidation } from "~/utils/validation/user";
import type { IAnyObject } from "~/types"
import type { TUserCredentials } from "./Login";


class LoginInputsFactory extends InputsFactory<TUserCredentials> {
    protected _inputsDefinition: IAnyObject = {
        username: {
            type: 'text',
            label: 'Email',
            required: true,
            validator: usernameValidation
        },
        password: {
            type: 'password',
            label: 'Password',
            required: true,
            validator: passwordValidation
        }
    }

    protected _sortedProperties = ['username', 'password'] as Array<keyof TUserCredentials>
}

export default LoginInputsFactory