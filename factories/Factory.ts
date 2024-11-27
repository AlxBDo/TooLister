import type { IAnyObject } from "~/types";

export abstract class Factory<T extends IAnyObject> {
    private _model: T = {} as T

    create(item?: T) {
        return this.populateItemFromModel(item)
    }

    get model() { return this._model; }

    protected getPropertyValueFromItem(propertyName: string, item: IAnyObject): any {
        if (item[propertyName] !== undefined) {
            return item[propertyName]
        }
    }

    protected populateItemFromModel(item?: Partial<T>): T {
        if (item) {
            return Object.keys(this._model).reduce(
                (acc, curr: string) => {
                    acc[curr] = this.getPropertyValueFromItem(curr, item) ?? this._model[curr]
                    return acc
                },
                {} as IAnyObject
            ) as T
        }

        return this._model
    }

    protected setModel(model: T): void {
        if (model) {
            this._model = model;
        }
    }
}