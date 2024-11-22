import type { Liste } from "~/models/liste";
import type { StateTree } from "pinia";
import type { TList, TListTypesMap } from "~/types/list";
import ItemManager from "./Item";


export default class ListManager {

    static readonly LIST_PROPERTIES: TList = {
        ...ItemManager.STD_ITEM,
        type: undefined
    }

    private static readonly STATE_PROPERTIES: StateTree = {
        "@id": undefined,
        "@type": "Liste"
    }

    static readonly TYPE_COLLECTION: string = "collection"
    static readonly TYPE_GIFT: string = "gift"
    static readonly TYPE_MAINTEANCE: string = "maintenance"
    static readonly TYPE_RECIPE: string = "recipe"
    static readonly TYPE_SHOPPING: string = "shopping"
    static readonly TYPE_TASK: string = "task"
    static readonly TYPES: TListTypesMap = {
        "0": this.TYPE_COLLECTION,
        "1": this.TYPE_GIFT,
        "2": this.TYPE_MAINTEANCE,
        "3": this.TYPE_RECIPE,
        "4": this.TYPE_SHOPPING,
        "5": this.TYPE_TASK,
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
        ...this.TYPES,
        "1": "cadeaux",
        "3": "recettes",
        "5": "tâches"
    }


    static create(list?: Liste): TList {
        if (!list) { return this.LIST_PROPERTIES }

        const owner = list?.owner ?? `apip/users/${useConnectedUser().user.id}`

        return {
            ...this.LIST_PROPERTIES,
            ...ItemManager.getItemProperties({ ...list, owner })
        }
    }

    static createState(list: Liste): StateTree {
        return {
            ...this.create(list),
            ...this.STATE_PROPERTIES,
            ...list
        }
    }

}