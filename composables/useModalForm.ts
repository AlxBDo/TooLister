import type { TListTypes } from "~/managers/List";
import type { Item } from "~/models/item";
import type { IAnyObject } from "~/types";
import type { TInput } from "~/types/form/input";
import type { Ref } from "vue";

interface IModalFormProps<T extends Item> {
    failureCallback?: (error: any) => void;
    htmlClass?: IAnyObject;
    id: string;
    inputs: TInput[];
    item?: T;
    listType?: TListTypes;
    successCallback: (item: Promise<Ref<T>>) => void;
}

export interface IModalForm<T extends Item> extends IModalFormProps<T> {
    isOpen: Ref<boolean>;
    itemIsPending: boolean;
    path: string;
}

export type TModalForm<T extends Item> = Omit<IModalForm<T>, 'itemIsPending'>

const forms = [] as Ref<IAnyObject>[]

function getFormById(id: string) {
    return forms.find((f: IAnyObject) => f.value.id === id)
}

export default function useModalForm<T extends Item>(form: string | TModalForm<T>) {
    const modalForm = typeof form === 'string'
        ? getFormById(form)
        : createForm(form)


    function addForm(form: IModalForm<T>) {
        const newForm = ref<IModalForm<T>>(form)
        forms.push(newForm)
    }

    function createForm(form: TModalForm<T>): Ref<IModalForm<T>> {
        const defaultProperties = {
            isOpen: false,
            itemIsPending: false
        }

        const newForm = {
            ...defaultProperties,
            ...form
        }

        addForm(newForm)

        return getFormById(form.id) as Ref<IModalForm<T>>
    }

    function getFormProps(): IModalFormProps<T> | undefined {
        if (!modalForm?.value) { return }
        const { htmlClass, id, inputs, item, listType, successCallback } = modalForm.value
        return { htmlClass, id, inputs, item, listType, successCallback }
    }

    return { addForm, getFormProps, modalForm }
}