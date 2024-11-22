import { lazy, mixed, number, string } from "yup";
import { stringMinLength, validationMessage, varcharMaxLength } from ".";

const categoryMinValue = 0;

const nameMaxLength = 100;

const urlMinLength = 12;


export const categoryValidation = lazy(
    (value) => typeof value === "string"
        ? string().max(60, validationMessage("La catégorie", "maxLength", 60))
            .min(stringMinLength, validationMessage("La catégorie", "minLength", stringMinLength))
        : number().min(categoryMinValue, validationMessage("La catégorie", "min", categoryMinValue))
)

export const descriptionValidation = string()
    .max(varcharMaxLength, validationMessage("La description", "maxLength", varcharMaxLength))
    .min(stringMinLength, validationMessage("La description", "minLength", stringMinLength))

export const nameValidation = string()
    .max(nameMaxLength, validationMessage("Le nom", "maxLength", nameMaxLength))
    .min(stringMinLength, validationMessage("Le nom", "minLength", stringMinLength)).required()

export const urlValidation = string().url('Url invalide')
    .max(varcharMaxLength, validationMessage("L'url", "maxLength", varcharMaxLength))
    .min(urlMinLength, validationMessage("L'url", "minLength", urlMinLength))