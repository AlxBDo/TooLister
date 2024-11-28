import type { IInput, IInputWithOptions, ISelect } from "~/types/form/input";



export type TStdInput = Omit<IInput, 'name' | 'type'> & { name?: string; type?: string };

export type TInputWithOptions = Omit<IInputWithOptions, 'name' | 'type'> & { name?: string; type?: string };

export type TSelect = Omit<ISelect, 'name' | 'type'> & { name?: string; type?: string };