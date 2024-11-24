import { LIST_TYPES } from "~/models/liste";

import type { TListTypes } from "~/types/list";


export default class ListItemManager {
    static getItemRessource(itemType: TListTypes): string {
        return `${LIST_TYPES[itemType]}_items`;
    }

    static getItemType(itemType: TListTypes): string {
        return LIST_TYPES[itemType];
    }
}