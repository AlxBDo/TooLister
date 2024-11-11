import { number, string } from "yup";
import { stringMinLength, validationMessage, varcharMaxLength } from ".";

const categoryMaxValue = 999;
const categoryMinValue = 0;

const nameMaxLength = 100;

const urlMinLength = 12;


export const categoryValidation = number()
    .min(categoryMinValue, validationMessage("La catégorie", "min", categoryMinValue))
    .max(categoryMaxValue, validationMessage("La catégorie", "max", categoryMaxValue))

export const descriptionValidation = string()
    .max(varcharMaxLength, validationMessage("La description", "maxLength", varcharMaxLength))
    .min(stringMinLength, validationMessage("La description", "minLength", stringMinLength))

export const nameValidation = string()
    .max(nameMaxLength, validationMessage("Le nom", "maxLength", nameMaxLength))
    .min(stringMinLength, validationMessage("Le nom", "minLength", stringMinLength)).required()

export const urlValidation = string().url('Url invalide')
    .max(varcharMaxLength, validationMessage("L'url", "maxLength", varcharMaxLength))
    .min(urlMinLength, validationMessage("L'url", "minLength", urlMinLength))