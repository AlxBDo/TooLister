import { string } from "yup"

export const listTypeValidation = string().oneOf(['0', '1', '2', '3', '4', '5']).required('Requis')