import type { Category } from "~/models/category";
import type { ISearchCriteria } from "~/types";
import CategoryRepository from "~/repositories/Category";
import { useCategoryListStore } from "~/stores/category/list";
import { useListeListStore } from "~/stores/liste/list";
import type { TListTypes } from "~/types/list";
import type { Liste } from "~/models/liste";

interface IGetCategoryParams extends ISearchCriteria, Partial<Category> {
    name?: string
}


export default function useCategories() {
    const categoryList = useCategoryListStore()
    const { items, isLoading } = storeToRefs(categoryList)

    if (!items?.value.length) { fetchCategories() }

    async function fetchCategories() {
        const listTypes = useListeListStore().items.reduce(
            (acc: TListTypes[], item: Liste) => {
                if (!acc.includes(item.type as TListTypes)) {
                    acc.push(item.type as TListTypes)
                }
                return acc
            },
            [] as TListTypes[])

        categoryList.setData(await CategoryRepository.getCategories({ listTypes }))
    }

    function getCategory(searchBy: IGetCategoryParams) {
        return categoryList.getItem<Category>(searchBy)
    }

    function searchCategories(searchBy: IGetCategoryParams) {
        return categoryList.searchCategories(searchBy)
    }

    return { categories: items, getCategory, isLoading, searchCategories }
}