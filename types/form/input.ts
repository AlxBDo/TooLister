import type { IStdComponent } from "~/types";
import type { IStringObject, TComponentSize } from "~/types";


export interface IStdInput extends IStdComponent {
    color?: TColors;
    description?: string;
    disabled: boolean;
    help?: string;
    hint?: string;
    icon?: string;
    id?: string;
    label?: string;
    loading?: boolean;
    name: string;
    placeholder?: string;
    required: boolean;
    size?: TComponentSize;
    type: TInputType;
    ui?: IStringObject
    validator: object;
    variant?: TVariant;
}

export interface IInput extends IStdInput {
    value?: boolean | number | string;
}

export interface IInputWithOptions extends IInput {
    creatable?: boolean;
    multiple?: boolean;
    options?: IOption[];
    optionAttribute?: string;
    selectClass?: string;
    selectedIcon?: string;
    valueAttribute?: string;
}

export interface IOption {
    color?: string;
    id: string | number;
    label: string;
}

export interface ISelect extends IInputWithOptions {
    by?: string;
    clearSearchOnClose?: boolean;
    debounce?: number;
    loadingIcon?: string;
    query?: string;
    searchable?: any;
    searchAttributes?: string[];
}


export type TColors = 'blue' | 'gray' | 'green' | 'orange' | 'primary' | 'red' | 'white'

export type TInputType = 'checkbox' | 'date' | 'number' | 'radio' | 'select' | 'text' | 'textarea'

export type TInputValue = boolean | number | string | undefined

export type TInput = IInput | IInputWithOptions | ISelect

export type TInputOptions = string[] | { [key: string]: any; disabled?: boolean; }[]

export type TSearchableProps = (query: string) => any[] | Promise<any[]>

export type TVariant = 'outline' | 'none'