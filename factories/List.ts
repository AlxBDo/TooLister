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
        this.setModel(this.LIST);
    }

    protected override getPropertyValueFromItem(propertyName: keyof TList, item: Partial<TList>) {
        if (propertyName === 'owner') {
            return item?.owner ?? `apip/users/${useConnectedUser().user.id}`
        } else {
            return item[propertyName]
        }
    }
}

const listFactory = new ListFactory();

export default listFactory