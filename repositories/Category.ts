import ItemRepository from "./Item";
import type { Category } from "~/models/category";
import type { ISearchParams, IStringObject } from "~/types";
import type { TListTypes } from "~/types/list";

interface ISearchCategoryParams extends ISearchParams, Partial<Category> {
    name?: string;
}

interface ISearchCategoriesParams extends ISearchCategoryParams {
    listType?: TListTypes;
}


class CategoryRepository extends ItemRepository {

    private readonly endpoint: string = 'categories'


    /**
     * 
     * @param {ISearchCategoriesParams} params 
     * @returns 
     */
    async getCategories(params?: ISearchCategoriesParams) {
        useConsole().log('CategoryRepository getCategories')
        return await this.getItems<Category>(this.endpoint, params as IStringObject)
    }

    async getCategoryById(id: number | string) {
        return await this.getItemById<Category>(id, this.endpoint)
    }

    async getCategoryByListType(listType: TListTypes) {
        return await this.getCategories({ listType })
    }

    async getCategoryByName(name: string) {
        return await this.getCategories({ name })
    }

    async insertCategory(category: Category) {
        return await this.insertItem(category, this.endpoint);
    }
}

export default new CategoryRepository()