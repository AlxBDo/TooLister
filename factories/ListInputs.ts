import { nameValidation } from "~/utils/validation/listItem";
import InputsFromItem from "./InputsFromItem";
import type { TList } from "~/types/list";
import type { IAnyObject } from "~/types";
import type { IOption, ISelect, IStdInput } from "~/types/form/input";
import { listTypeValidation } from "~/utils/validation/list";
import { capitalize } from "vue";
import ListManager from "~/managers/List";

export default class ListInputsFactory extends InputsFromItem<TList> {

    private readonly PROPERTIES_SORT_MAPPING: Array<keyof TList> = ['name', 'type']

    private readonly INPUT_MAPPING_BY_PROPERTY: IAnyObject = {
        name: { label: 'Nom', name: 'name', type: 'text', validator: nameValidation } as IStdInput,
        type: {
            label: 'Liste de',
            name: 'type',
            options: this.createTypesSelectOptions(ListManager.TYPE_LABELS),
            placeholder: "course, taches, ...",
            type: 'select',
            validator: listTypeValidation
        } as ISelect
    }

    constructor() {
        super()
        this.inputsDefinition = this.INPUT_MAPPING_BY_PROPERTY
        this.propertiesSorted = this.PROPERTIES_SORT_MAPPING
    }

    private createTypesSelectOptions(options: IAnyObject): IOption[] {
        return Object.keys(options).map(key => ({ id: key, label: capitalize(options[key]) }))
    }

}