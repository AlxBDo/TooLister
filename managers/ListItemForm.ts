import type { GiftItem } from "~/models/giftitem";
import type { IAnyObject } from "~/types";
import type { ListItem } from "~/models/listitem";
import type { ShoppingItem } from "~/models/shoppingitem";
import type { TaskItem } from "~/models/taskitem";
import type { TInput, IStdInput, ISelect } from "~/types/form/input";
import type { TListTypes } from "~/types/list";

import CategoryManager from "./Category";
import { categoryValidation, descriptionValidation, nameValidation, urlValidation } from "~/utils/validation/listItem";
import InputManager from "./Input";
import ListItemManager from "./ListItem";
import ListManager from "./List";
import { priceValidation, quantityUnitValidation, quantityValidation } from "~/utils/validation/shoppingItem";


export type TListItem = GiftItem | ListItem | ShoppingItem | TaskItem;


export default class ListItemFormManager {

    private static readonly LISTITEM_PROPERTIES_SORT_MAPPING: Record<TListTypes, string[]> = {
        '0': ['name', 'category', 'url', 'buyers', 'description', 'price', 'quantity', 'quantityUnit'],
        '1': ['name', 'description', 'preferenceOrder', 'price', 'quantity', 'quantityUnit', 'category', 'url', 'buyers'],
        '2': ['name', 'category', 'url', 'buyers', 'description', 'price', 'quantity', 'quantityUnit'],
        '3': ['name', 'category', 'url', 'buyers', 'description', 'price', 'quantity', 'quantityUnit'],
        '4': ['name', 'description', 'category', 'quantity', 'quantityUnit', 'price', 'url'],
        '5': ['name', 'description', 'priority', 'startDate', 'dueDate', 'duration', 'durationType', 'category', 'url']
    }

    private static readonly INPUT_MAPPING_BY_PROPERTY: IAnyObject = {
        category: InputManager.createSelectProperties({
            debounce: 750,
            creatable: true,
            options: InputManager.createOptionsFromItems(useCategories().categories.value, {}),
            placeholder: 'Categorie',
            searchable: CategoryManager.searchCategory,
            searchAttributes: ['label'],
            type: 'select',
            validator: categoryValidation
        } as ISelect
        ),
        description: InputManager.createInputProperties(
            { placeholder: 'Description', type: 'textarea', validator: descriptionValidation } as IStdInput
        ),
        name: InputManager.createInputProperties(
            { placeholder: 'Nom', type: 'text', validator: nameValidation } as IStdInput
        ),
        url: InputManager.createInputProperties(
            { placeholder: "url", type: 'text', validator: urlValidation } as IStdInput
        ),
        buyers: InputManager.createInputProperties(
            { placeholder: "Acheteurs", type: 'select' } as IStdInput
        ),
        preferenceOrder: InputManager.createInputProperties(
            { placeholder: 'Ordre de préférence', type: 'number' } as IStdInput
        ),
        price: InputManager.createInputProperties(
            { placeholder: 'Prix', type: 'number', validator: priceValidation } as IStdInput
        ),
        quantity: InputManager.createInputProperties(
            { placeholder: 'Qté', type: 'number', validator: quantityValidation } as IStdInput
        ),
        quantityUnit: InputManager.createSelectProperties(
            { placeholder: "Unité", options: InputManager.createOptions(ListItemManager.QUANTITY_UNITS), type: 'select', validator: quantityUnitValidation } as ISelect
        ),
        dueDate: InputManager.createInputProperties(
            { placeholder: 'Echéance', type: 'date' } as IStdInput
        ),
        duration: InputManager.createInputProperties(
            { placeholder: 'Durée', type: 'number' } as IStdInput
        ),
        durationType: InputManager.createSelectProperties(
            { placeholder: "Choisir", options: InputManager.createOptions(ListItemManager.DURATION_TYPES), type: 'select' } as ISelect
        ),
        priority: InputManager.createSelectProperties(
            { placeholder: "Priorité", options: InputManager.createOptions(ListItemManager.PRIORITIES), type: 'select' } as ISelect
        ),
        startDate: InputManager.createInputProperties(
            { placeholder: 'Date', type: 'date' } as IStdInput
        )
    }

    static createItemInputs(item: TListItem, listType: TListTypes): TInput[] {
        return InputManager.createInputs(
            item,
            this.INPUT_MAPPING_BY_PROPERTY,
            this.LISTITEM_PROPERTIES_SORT_MAPPING[listType],
            ['status']
        )
    }

    static submiDataFormater(item: TListItem, listType: TListTypes): TListItem {
        const integerProperties = ['durationType', 'priority']

        integerProperties.forEach(property => {
            if (item[property]) {
                item[property] = parseInt(item[property])
            }
        })

        if (listType === ListManager.TYPE_GIFT) {
            if (item.buyers) { delete item.buyers }
        }

        if (!item.category) {
            item.category = undefined
        } else if (typeof item.category === 'number') {
            item.category = `/apip/categories/${item.category}`
        } else if (typeof item.category === 'string') {
            item.category = CategoryManager.populateCategory({ name: item.category, listType })
        }

        return item
    }

}