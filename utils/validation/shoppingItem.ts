import { number } from "yup"
import { validationMessage } from "."

export const priceValidation = number().min(0.1, validationMessage("Le prix", "min", 0.1))

export const quantityValidation = number().integer().min(0, validationMessage("La quanité", "min", 0))

export const quantityUnitValidation = number().integer().min(0, validationMessage("L'unité'", "min", 0))