import type { IAnyObject, IFunctionObject, IObjectStringObject, IStdComponent } from '..';
import type { TInput, TInputValue } from './input';

export interface IForm extends IStdComponent {
    cancelButton?: boolean | string;
    cancelFunction?: () => boolean;
    inputs: TInput[];
    submitButton?: boolean | string;
    title?: string;
}

interface IInputsState {
    [key: string]: TInputValue;
}

export interface IInputs {
    schema: IAnyObject;
    state: IInputsState;
}