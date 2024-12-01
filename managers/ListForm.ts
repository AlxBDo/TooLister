import type { TList } from "~/types/list"
import ListRepository from "~/repositories/List"
import ListInputsFactory from "~/factories/ListInputs"
import listFactory from "~/factories/List"


export default class ListFormManager {

    static getInputsFromItemProps(item: TList) {
        const list = listFactory.create(item)

        const listInpustFactory = new ListInputsFactory()
        return listInpustFactory.create(list)
    }

    static saveList(newList: TList, oldList?: TList) {
        return oldList?.id
            ? ListRepository.update(newList, oldList)
            : ListRepository.insert(newList)
    }
}