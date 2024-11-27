import type { ListItem } from "~/models/listitem";
import ItemFactory from "./Item";


export default class STDListItemFactory extends ItemFactory {
    readonly LIST_ITEM: ListItem = {
        ...this.STD_ITEM,
        category: undefined,
        description: undefined,
        list: undefined,
        status: 1,
        url: undefined,
    }

    constructor() {
        super()
        this.setModel(this.LIST_ITEM)
    }
}