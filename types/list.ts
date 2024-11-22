import type { Liste } from "~/models/liste";


export type TList = Omit<Liste, '@id' | 'id' | 'name' | 'type'> & { id?: number, name?: string, type?: TListTypes }

export type TListTypes = "0" | "1" | "2" | "3" | "4" | "5"

export type TListTypesMap = Record<TListTypes, string>;