import { string } from 'yup';

import { firstnameMaxValue, firstnameMinValue, emailValidation, validationMessage } from '.';

export const usernameValidation = emailValidation;

export const passwordMinValue = 8;
export const passwordValidation = string()
    .min(passwordMinValue, validationMessage("Ton mot de passe", "minLength", passwordMinValue))
    .required('Required');

export const firstnameValidation = string()
    .max(firstnameMaxValue, validationMessage("Ton prénom", "maxLength", firstnameMaxValue))
    .min(firstnameMinValue, validationMessage("Ton prénom", "minLength", firstnameMinValue))