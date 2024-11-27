import type { IInput, IInputWithOptions, ISelect, TInput, TInputType, TInputValue } from "~/types/form/input";
import type { IAnyObject } from "~/types";
import { sortArrayObjectFromStringArray } from "~/utils/object";
import OptionsInputFactory from "./OptionsInput";
import SelectFactory from "./Select";
import InputFactory from "./Input";


export type TStdInput = Omit<IInput, 'name' | 'type'> & { name?: string; type?: string };

export type TInputWithOptions = Omit<IInputWithOptions, 'name' | 'type'> & { name?: string; type?: string };

export type TSelect = Omit<ISelect, 'name' | 'type'> & { name?: string; type?: string };


const inputClass = { xSmall: 'w-1/4', small: 'w-1/3', half: 'w-1/2', large: '2/3', xLarge: 'w-3/4w-', full: 'w-full' }

const logStyle = { bgColor: 'darkblue', icon: '🏭' }


export default abstract class InputsFactory<T extends IAnyObject> {
    private _factories = {
        input: new InputFactory(),
        optionsInput: new OptionsInputFactory(),
        select: new SelectFactory()

    }

    private _inputsDefinition?: IAnyObject

    private _propertiesSorted?: Array<keyof T>


    protected readonly FACTORIES_MAP_BY_TYPE: Record<TInputType, InputFactory | OptionsInputFactory | SelectFactory> = {
        checkbox: this._factories.optionsInput,
        date: this._factories.input,
        number: this._factories.input,
        radio: this._factories.optionsInput,
        select: this._factories.select,
        text: this._factories.input,
        textarea: this._factories.input
    }


    get inputsDefinition(): IAnyObject | undefined { return this._inputsDefinition }

    get propertiesSorted(): Array<keyof T> | undefined { return this._propertiesSorted }


    set inputsDefinition(inputsDefinition: IAnyObject) {
        if (inputsDefinition) {
            this._inputsDefinition = inputsDefinition
        }
    }

    set propertiesSorted(properties: Array<keyof T>) {
        if (properties.length) {
            this._propertiesSorted = properties
        }
    }


    create(item: T): TInput[] {
        if (!this._inputsDefinition || !this._inputsDefinition.length) {
            throw new Error('No inputs definition provided')
        }

        const inputs = Object.keys(item).reduce((acc: any, curr: string) => {
            if (this._inputsDefinition && this._inputsDefinition[curr]) {
                acc = [...acc, this.createInput(item[curr], curr, this._inputsDefinition[curr])]
            }
            return acc
        }, [])

        return this.sortInputs(inputs)
    }

    private createInput(value: any, name: string, inputProperties: TStdInput) {
        if (!inputProperties.name) { throw new Error('Name type not defined') }
        if (!inputProperties.type) { throw new Error('Input type not defined') }

        if (typeof value === 'object') {
            value = this.getInputValue(value, name)
        }

        return this.FACTORIES_MAP_BY_TYPE[inputProperties.type as TInputType].create({
            ...this.getInputProperties(inputProperties, name),
            value
        })
    }

    /**
     * Rewrite this method to define specific logic for an input
     * @param {object} properties 
     * @param {string} name 
     * @returns 
     */
    protected getInputProperties(properties: TStdInput, type: TInputType): TStdInput {
        return properties
    }

    /**
     * Rewrite this method to define specific logic for an input
     * @param {object} value 
     * @param {string} name 
     * @returns 
     */
    protected getInputValue(value: IAnyObject, name: string): TInputValue {
        if (!value?.id) {
            throw new Error('Id not defined. Rewrite method to define new logic.')
        }

        return value?.id
    }

    private sortInputs(inputs: TInput[]): TInput[] {
        return this._propertiesSorted
            ? sortArrayObjectFromStringArray<TInput>(inputs, this._propertiesSorted as string[])
            : inputs
    }
}