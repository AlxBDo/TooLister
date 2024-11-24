import type { TList } from "~/types/list";
import ItemFactory from "./Item";


class ListFactory extends ItemFactory {
    readonly LIST: TList = {
        ...this.STD_ITEM,
        owner: undefined,
        type: undefined
    }

    constructor() {
        super();
        this.setItem(this.LIST);
    }

    protected override populateItem(list: TList) {
        const owner = list?.owner ?? `apip/users/${useConnectedUser().user.id}`
        return {
            ...list,
            owner
        }
    }
}

const listFactory = new ListFactory();

export default listFactory