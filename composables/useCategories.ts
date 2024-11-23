import type { Category } from "~/models/category";
import type { ISearchParams } from "~/types";
import CategoryRepository from "~/repositories/Category";
import { useCategoryListStore } from "~/stores/category/list";
import { arrayObjectFindBy } from "~/utils/object";

interface IGetCategoryParams extends ISearchParams, Partial<Category> {
    name?: string
}


export default function useCategories() {
    const categoryList = useCategoryListStore()
    const { items, isLoading } = storeToRefs(categoryList)

    if (!items?.value.length) { fetchCategories() }

    async function fetchCategories() {
        // TODO - param listType[] + modif type ISearchCategoyParams
        categoryList.setData(await CategoryRepository.getCategories())
    }

    function getCategory(searchBy: IGetCategoryParams) {
        return categoryList.getItem<Category>(searchBy) //arrayObjectFindBy<Category>(items.value, searchBy)
    }

    return { categories: items, getCategory, isLoading }
}