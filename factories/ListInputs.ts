import { nameValidation } from "~/utils/validation/listItem";
import InputsFromItem from "./InputsFromItem";
import type { TList } from "~/types/list";
import type { IAnyObject } from "~/types";
import type { IOption, ISelect, IStdInput, TInputValue } from "~/types/form/input";
import { listTypeValidation } from "~/utils/validation/list";
import { capitalize } from "vue";
import ListManager from "~/managers/List";

export default class ListInputsFactory extends InputsFromItem<TList> {

    protected override _inputsDefinition: IAnyObject = {
        name: { label: 'Nom', type: 'text', validator: nameValidation } as IStdInput,
        type: {
            label: 'Liste de',
            options: this.createTypesSelectOptions(ListManager.TYPE_LABELS),
            placeholder: "course, taches, ...",
            type: 'select',
            validator: listTypeValidation
        } as ISelect
    }

    protected override _sortedProperties?: Array<keyof TList> = ['name', 'type']


    private createTypesSelectOptions(options: IAnyObject): IOption[] {
        return Object.keys(options).map(key => ({ id: key, label: capitalize(options[key]) }))
    }
}