import type { Liste } from "~/models/liste";
import type { StateTree } from "pinia";
import type { TListTypesMap } from "~/types/list";

import { LIST_TYPES } from "~/models/liste";
import listFactory from "~/factories/List";


export default class ListManager {
    private static readonly STATE_PROPERTIES: StateTree = {
        "@id": undefined,
        "@type": "Liste"
    }

    static readonly TYPE_ICONS: TListTypesMap = {
        "0": 'i-mdi-database',
        "1": 'i-mdi-gift-outline',
        "2": 'i-mdi-tools',
        "3": 'i-mdi-food-turkey',
        "4": 'i-mdi-shopping-outline',
        "5": 'i-mdi-calendar-today-outline',
    }

    static readonly TYPE_LABELS: TListTypesMap = {
        ...LIST_TYPES,
        "1": "cadeaux",
        "3": "recettes",
        "5": "tâches"
    }


    static createState(list: Liste): StateTree {
        return {
            ...listFactory.create(list),
            ...this.STATE_PROPERTIES,
            ...list
        }
    }
}