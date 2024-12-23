import type { IAnyObject } from "~/types";
import type { TInput, TInputType, TInputValue } from "~/types/form/input";
import type { TStdInput } from "~/types/factory";
import InputFactory from "./Input";
import OptionsInputFactory from "./OptionsInput";
import SelectFactory from "./Select";
import { sortArrayObjectFromStringArray } from "~/utils/object";


const logStyle = { bgColor: 'darkblue', icon: '🏭' }


export default abstract class InputsFactory<T extends IAnyObject> {
    private _factories = {
        input: new InputFactory(),
        optionsInput: new OptionsInputFactory(),
        select: new SelectFactory()

    }

    protected abstract _inputsDefinition: IAnyObject

    protected abstract _sortedProperties?: Array<keyof T> | Record<string, Array<keyof T>>


    protected readonly FACTORIES_MAP_BY_TYPE: Record<TInputType, InputFactory | OptionsInputFactory | SelectFactory> = {
        checkbox: this._factories.optionsInput,
        date: this._factories.input,
        email: this._factories.input,
        number: this._factories.input,
        password: this._factories.input,
        radio: this._factories.optionsInput,
        select: this._factories.select,
        text: this._factories.input,
        textarea: this._factories.input
    }


    get inputsDefinition(): IAnyObject | undefined { return this._inputsDefinition }

    get sortedProperties(): Array<keyof T> | Record<string, Array<keyof T>> | undefined {
        return this._sortedProperties
    }


    set inputsDefinition(inputsDefinition: IAnyObject) {
        if (inputsDefinition) {
            this._inputsDefinition = inputsDefinition
        }
    }

    set sortedProperties(properties: Array<keyof T>) {
        if (properties.length) {
            this._sortedProperties = properties
        }
    }


    create(item: T): TInput[] {
        if (!this._inputsDefinition) {
            throw new Error('No inputs definition provided')
        }

        const inputs = Object.keys(item).reduce((acc: any, curr: string) => {
            if (this._inputsDefinition && this._inputsDefinition[curr]) {
                acc = [...acc, this.createInput(item[curr], curr, this._inputsDefinition[curr])]
            }
            return acc
        }, [])

        //useConsole().log('InputsFactory', ['item', item, 'inputs', inputs, 'definitions', this._inputsDefinition], logStyle)

        return this.sortInputs(inputs)
    }

    private createInput(value: any, name: string, inputProperties: TStdInput) {
        if (!inputProperties.type) { throw new Error('Input type not defined') }

        if (!inputProperties.name) { inputProperties.name = name }

        const inputType = inputProperties.type as TInputType

        if (typeof value === 'object') {
            value = this.getInputValue(value, name)
        }

        return this.FACTORIES_MAP_BY_TYPE[inputType].create({
            ...this.getInputProperties(inputProperties, inputType),
            value
        })
    }

    /**
     * Rewrite this method to define specific logic for input properties
     * @param {object} properties 
     * @param {string} name 
     * @returns 
     */
    protected getInputProperties(properties: TStdInput, type: TInputType): TStdInput {
        return properties
    }

    /**
     * Rewrite this method to define specific logic to get input value
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

    /**
     * Rewrite this method to define sort
     * @param inputs 
     * @returns 
     */
    protected sortInputs(inputs: TInput[]): TInput[] {
        const sortedProperties = this.sortedProperties
        return sortedProperties
            ? sortArrayObjectFromStringArray<TInput>(inputs, sortedProperties as string[])
            : inputs
    }
}