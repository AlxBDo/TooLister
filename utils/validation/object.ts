import { object } from "yup"
import type { IAnyObject } from "~/types"

const logStyleOptions = {
    bgColor: '#d8b32b',
    icon: '☢️'
}

export const areIdentical = (object1: IAnyObject, object2: IAnyObject, compareLength: boolean = true) => {
    if (!object2 || (compareLength && object1.length !== object2.length)) {
        return false
    }

    return Object.keys(object1).reduce((acc, key) => {
        if (acc) {
            if (!object1[key] || !object2[key]) {
                acc = object1[key] === object2[key]
            } else if (Array.isArray(object1[key])) {
                acc = object1[key].length === object2[key]?.length
                acc && object1[key].forEach((item: any, index: number) => {
                    if (!acc) { return acc }
                    if (typeof item === 'object') {
                        acc = areIdentical(item, object2[key][index]);
                    } else if (item !== object2[key][index]) {
                        acc = false
                    }
                })

                /**
                acc = Object.keys(object1[key]).reduce((acc, curr) => {
                    if (acc) {
                        acc = (object1[key][curr] && object2[key][curr] && (
                            typeof object1[key][curr] === 'object' || Array.isArray(object1[key][curr])
                        ) ? areIdentical(object1[key][curr], object2[key][curr])
                            : object1[key][curr] === object2[key][curr]) as boolean
                    }
                    return acc
                }, true)
                */
            } else if (typeof object1[key] === 'object') {
                acc = areIdentical(object1[key], object2[key], false)
            } else { acc = object1[key] === object2[key] }
        }
        return acc
    }, true)
}