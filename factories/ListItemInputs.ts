import { DURATION_TYPES, PRIORITIES, QUANTITY_UNITS } from "~/models/listitem";
import type { TListItem } from "~/managers/ListItemForm";
import type { TListTypes } from "~/types/list";
import type { IAnyObject } from "~/types";
import type { ISelect, IStdInput, TInputValue } from "~/types/form/input";
import InputManager from "~/managers/Input";
import CategoryManager from "~/managers/Category";
import { categoryValidation, descriptionValidation, nameValidation, urlValidation } from "~/utils/validation/listItem";
import { priceValidation, quantityUnitValidation, quantityValidation } from "~/utils/validation/shoppingItem";
import InputsFromItem from "./InputsFromItem";

export default class ListItemInputsFactory extends InputsFromItem<TListItem> {
    protected override _inputsDefinition: IAnyObject = {
        category: {
            debounce: 750,
            creatable: true,
            options: InputManager.createOptionsFromItems(useCategories().categories.value, {}),
            placeholder: 'Categorie',
            searchable: CategoryManager.searchCategory,
            searchAttributes: ['label'],
            type: 'select',
            validator: categoryValidation
        } as ISelect,

        description: { placeholder: 'Description', type: 'textarea', validator: descriptionValidation } as IStdInput,

        name: { placeholder: 'Nom', type: 'text', validator: nameValidation } as IStdInput,

        url: { placeholder: "url", type: 'text', validator: urlValidation } as IStdInput,

        buyers: { placeholder: "Acheteurs", type: 'select' } as IStdInput,

        preferenceOrder: { placeholder: 'Ordre de préférence', type: 'number' } as IStdInput,

        price: { placeholder: 'Prix', type: 'number', validator: priceValidation } as IStdInput,

        quantity: { placeholder: 'Qté', type: 'number', validator: quantityValidation } as IStdInput,

        quantityUnit: {
            placeholder: "Unité",
            options: InputManager.createOptions(QUANTITY_UNITS),
            type: 'select', validator: quantityUnitValidation
        } as ISelect,

        dueDate: { placeholder: 'Echéance', type: 'date' } as IStdInput,

        duration: { placeholder: 'Durée', type: 'number' } as IStdInput,

        durationType: {
            placeholder: "Choisir",
            options: InputManager.createOptions(DURATION_TYPES),
            type: 'select'
        } as ISelect,

        priority: { placeholder: "Priorité", options: InputManager.createOptions(PRIORITIES), type: 'select' } as ISelect,

        startDate: { placeholder: 'Date', type: 'date' } as IStdInput
    }

    private listType: TListTypes

    protected override _sortedProperties = {
        '0': ['name', 'category', 'url', 'buyers', 'description', 'price', 'quantity', 'quantityUnit'],
        '1': ['name', 'description', 'preferenceOrder', 'price', 'quantity', 'quantityUnit', 'category', 'url', 'buyers'],
        '2': ['name', 'category', 'url', 'buyers', 'description', 'price', 'quantity', 'quantityUnit'],
        '3': ['name', 'category', 'url', 'buyers', 'description', 'price', 'quantity', 'quantityUnit'],
        '4': ['name', 'description', 'category', 'quantity', 'quantityUnit', 'price', 'url'],
        '5': ['name', 'description', 'priority', 'startDate', 'dueDate', 'duration', 'durationType', 'category', 'url']
    }


    constructor(listType: TListTypes) {
        super()
        this.listType = listType
    }

    protected override getInputValue(value: IAnyObject, name: string): TInputValue {
        if (name === 'category') {
            return CategoryManager.populateCategory(value).name
        }

        return super.getInputValue(value, name)
    }

    override get sortedProperties() {
        return this._sortedProperties[this.listType]
    }
}