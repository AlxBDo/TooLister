import type { ListItem } from "~/models/listitem";
import type { GiftItem } from "~/models/giftitem";
import type { ShoppingItem } from "~/models/shoppingitem";
import type { TaskItem } from "~/models/taskitem";
import type { TListItem } from "./ListItemForm";
import ItemManager from "./Item";
import ListManager from "./List";
import type { TListTypes } from "~/types/list";


export default class ListItemManager {

    static readonly STD_ITEM: ListItem = {
        ...ItemManager.STD_ITEM,
        category: undefined,
        description: undefined,
        status: 1,
        url: undefined,
    }

    static readonly SHOPPING_ITEM: ShoppingItem = {
        ...ListItemManager.STD_ITEM,
        price: undefined,
        quantity: 1,
        quantityUnit: 0
    }

    static readonly GIFT_ITEM: GiftItem = {
        ...ListItemManager.SHOPPING_ITEM,
        buyers: undefined,
        preferenceOrder: 0
    }

    static readonly TASK_ITEM: TaskItem = {
        ...ListItemManager.STD_ITEM,
        dueDate: undefined,
        duration: 0,
        durationType: 0,
        priority: 0,
        startDate: undefined
    }


    static readonly DURATION_TYPES = {
        0: "minutes",
        1: "heure(s)",
        2: "jour(s)",
        3: "semaine(s)",
        4: "mois",
        5: "année(s)"
    }

    static readonly PRIORITIES = {
        0: "Aucune",
        1: "Basse",
        2: "Normale",
        3: "Haute",
        4: "Absolue"
    }

    static readonly QUANTITY_UNITS = {
        "0": "unité",
        "1": "gramme",
        "2": "kilo-gramme",
        "3": "centilitre",
        "4": "litre",
        "5": "boite",
        "6": "bouteille",
        "7": "minimètre",
        "8": "centimètre",
        "9": "mètre"
    }


    static create(item: TListItem, type: TListTypes): TListItem {
        let listItem
        switch (type) {
            case "0": case "2": case "3":
                // TODO: créer les autres list items
                listItem = ListItemManager.createItem(item);
                break;
            case "1":
                listItem = ListItemManager.createGiftItem(item);
                break;
            case "4":
                listItem = ListItemManager.createShoppingItem(item);
                break;
            case "5":
                listItem = ListItemManager.createTaskItem(item);
                break;
            default:
                throw new Error(`Invalid list item type: ${type}`);
        }
        return listItem;
    }

    static createItem(item: ListItem): ListItem {
        return { ...ListItemManager.STD_ITEM, ...item };
    }

    static createShoppingItem(item: ShoppingItem): ShoppingItem {
        return {
            ...ListItemManager.SHOPPING_ITEM,
            ...ItemManager.getItemProperties(item)
        };
    }

    static createGiftItem(item: GiftItem): GiftItem {
        return { ...ListItemManager.GIFT_ITEM, ...item };
    }

    static createTaskItem(item: TaskItem): TaskItem {
        return { ...ListItemManager.TASK_ITEM, ...item };
    }

    static getItemRessource(itemType: TListTypes): string {
        return `${ListManager.TYPES[itemType]}_items`;
    }

    static getItemType(itemType: TListTypes): string {
        return ListManager.TYPES[itemType];
    }
}