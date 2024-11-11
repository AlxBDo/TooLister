
export interface UserPayloadInterface {
    username: string;
    password: string;
}

export interface LoginSubmitProps extends UserPayloadInterface {
    callback?: Function;
}