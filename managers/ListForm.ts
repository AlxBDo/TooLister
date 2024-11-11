import InputManager from "./Input"
import ListManager from "./List"
import { nameValidation } from "~/utils/validation/listItem"
import { listTypeValidation } from "~/utils/validation/list"
import type { IAnyObject } from "~/types"
import type { ISelect, IStdInput, TInput } from "~/types/form/input"
import type { Liste } from "~/models/liste"


export default class ListFormManager {

    private static readonly LIST_PROPERTIES_SORT_MAPPING: string[] = ['name', 'type']

    private static readonly INPUT_MAPPING_BY_PROPERTY: IAnyObject = {
        name: InputManager.createInputProperties(
            { label: 'Nom', type: 'text', validator: nameValidation } as IStdInput
        ),
        type: InputManager.createSelectProperties(
            {
                label: 'Liste de',
                options: InputManager.createOptions(ListManager.TYPE_LABELS),
                placeholder: "course, taches, ...",
                type: 'select',
                validator: listTypeValidation
            } as ISelect
        )
    }


    static createInputs(list: Liste): TInput[] {
        return InputManager.createInputs(
            list,
            this.INPUT_MAPPING_BY_PROPERTY,
            this.LIST_PROPERTIES_SORT_MAPPING
        )
    }

}