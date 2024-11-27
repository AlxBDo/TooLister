import type { GiftItem } from "~/models/giftitem";
import ShoppingItemFactory from "./ShoppingItem";

export default class GiftItemFactory extends ShoppingItemFactory {
    readonly GIFT_ITEM: GiftItem = {
        ...this.SHOPPING_ITEM,
        buyers: undefined,
        preferenceOrder: 0
    }

    constructor() {
        super()
        this.setModel(this.GIFT_ITEM)
    }
}