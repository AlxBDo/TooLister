import type { Item } from "~/models/item";

export interface IAnyObject { [key: string]: any };

export interface IFunctionObject { [key: string]: Function };

export interface IStringObject { [key: string]: string };

export interface IObjectStringObject { [key: string]: IStringObject };


export interface IItem extends Item {
    id: number;
    name: string;
}

export interface IStdComponent {
    htmlClass?: IStringObject;
    id?: string;
}

export type TComponentSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'; 
