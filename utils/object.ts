import type { IAnyObject, ISearchParamObject } from "~/types";


type TConditionFunction = (item: IAnyObject) => boolean

export interface IValueLabelObject {
    icon?: string;
    label: string;
    value: string;
}


export function arrayObjectGroupBy(arrayOfObject: IAnyObject[], groupByKey: string): IAnyObject {
    return arrayOfObject.reduce((acc: IAnyObject, curr: IAnyObject) => {
        const currType = curr[groupByKey]
        if (currType) {
            if (!acc[currType]) { acc[currType] = [] }
            acc[currType].push(curr)
        }
        return acc
    }, {})
}

export function arrayObjectFindAllBy<T extends IAnyObject>(arrayOfObject: T[], findBy: ISearchParamObject & Partial<T>): T[] {
    return arrayOfObject.filter((item: T) => Object.keys(findBy).every((key: string) => item[key] === findBy[key]));
}

export function arrayObjectFindBy<T extends IAnyObject>(arrayOfObject: T[], findBy: ISearchParamObject & Partial<T>): T | undefined {
    return arrayOfObject.find((item: T) => Object.keys(findBy).every((key: string) => item[key] === findBy[key]));
}

export function mapObjectFromModel<T extends IAnyObject>(model: T, objectProperties?: Partial<T>) {
    return Object.keys(model).reduce((acc, curr) => {
        acc[curr] = (objectProperties && objectProperties[curr]) ?? model[curr]
        return acc
    }, {} as IAnyObject) as T
}

export function mapValueLabelObjects(values: string[], labels: IAnyObject, icons?: IAnyObject): IValueLabelObject[] {
    return values.map((value) => {
        const icon = icons && icons[value]
        return { value, label: labels[value], icon }
    });
}

export function removeItemOfObjectCollection(
    arrayOfObject: IAnyObject[],
    findIndexFunction: TConditionFunction
): IAnyObject {
    const index = arrayOfObject.findIndex(findIndexFunction)

    if (index > -1) {
        arrayOfObject.splice(index, 1);
    }

    return arrayOfObject;
}

export function sortArrayObjectFromStringArray<T extends IAnyObject>(
    inputs: T[],
    propertiesSorted: string[],
    referenceProperty: keyof T = 'name'
): T[] {
    return inputs.sort(
        (a: T, b: T): number => {
            return (a[referenceProperty] && b[referenceProperty])
                ? propertiesSorted.indexOf(a[referenceProperty]) - propertiesSorted.indexOf(b[referenceProperty])
                : 1
        }
    );
}

export function updateArrayOfObject(
    conditionFunction: TConditionFunction,
    object: IAnyObject,
    arrayOfObject: IAnyObject[]
): IAnyObject {
    const index = arrayOfObject.findIndex(conditionFunction)

    if (index > -1) {
        arrayOfObject[index] = object;
    }

    return arrayOfObject;
}