import { number, string } from 'yup'


export interface ObjectString {
    [key: string]: string;
};

export interface Verbs {
    format?: string;
    length?: string;
    value?: string;
}


export type ValidationType = "format" | "max" | "min" | "maxLength" | "minLength";
type Verb = "format" | "length" | "value";


export const firstnameMinValue = 2;
export const firstnameMaxValue = 70;

export const stringMinLength = 2
export const varcharMaxLength = 255


export const emailValidation = string().email('Email incorrect').required('Requis');


//-- validation message

export const verbs: ObjectString = {
    length: "être composé de",
    value: "être"
};

export const validationMessage = (fieldName: string, validationType: ValidationType, value: string | number) => {
    let verb = undefined;
    switch (validationType) {
        case "format":
            verb = validationType;
            break;
        case "max": case "min":
            verb = "value";
            break;
        case "maxLength": case "minLength":
            verb = "length";
            break;
    }

    const lengthSentenceComplement = (value: string | number, minOrMax: "maximum" | "minimum" = "minimum") => {
        return `${value} caractères ${minOrMax}`;
    }

    const sentencesComplement: ObjectString = {
        maxLength: lengthSentenceComplement(value),
        minLength: lengthSentenceComplement(value, "minimum")
    };

    if (sentencesComplement[validationType] && verb && verbs[verb]) {
        return `${fieldName} doit ${verbs[verb]} ${sentencesComplement[validationType]}.`;
    }
}