import type { Item } from "./item";
import type { TListTypes } from "~/types/list";

export interface Category extends Item {
    name?: string;
    listType?: TListTypes
} 