import type { TListTypes } from "~/types/list";
import GiftItemFactory from "./GiftItem";
import type { TItem } from "./Item";
import ShoppingItemFactory from "./ShoppingItem";
import STDListItemFactory from "./STDListItem";
import TaskItemFactory from "./TaskItem";


export default class ListItemFactory {
    static create<T extends TItem>(listType: TListTypes, listItem?: T): T {
        if (!listItem) { listItem = {} as T }
        let factory;
        switch (listType) {
            case "0": case "2": case "3":
                // TODO: créer les autres list items
                factory = new STDListItemFactory()
                break;
            case "1":
                factory = new GiftItemFactory()
                break;
            case "4":
                factory = new ShoppingItemFactory()
                break;
            case "5":
                factory = new TaskItemFactory()
                break;
            default:
                throw new Error(`Invalid list item type: ${listType}`);
        }
        return factory.create(listItem) as T;
    }
}