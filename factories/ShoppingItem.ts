import type { ShoppingItem } from "~/models/shoppingitem";
import STDListItemFactory from "./STDListItem";

export default class ShoppingItemFactory extends STDListItemFactory {
    readonly SHOPPING_ITEM: ShoppingItem = {
        ...this.LIST_ITEM,
        price: undefined,
        quantity: 1,
        quantityUnit: 0
    }

    constructor() {
        super()
        this.setModel(this.SHOPPING_ITEM)
    }
}