import type { Category } from "~/models/category";
import CategoryRepository from "~/repositories/Category";
import InputManager from "./Input";
import { useCategories } from "#imports";
import type { IOption } from "~/types/form/input";

export default class CategoryManager {
    static readonly categoryProperties: Category = {}

    static getCategory(category: Partial<Category>): Category | undefined {
        const { getCategory } = useCategories()
        return getCategory(category)
    }

    static populateCategory(category: Partial<Category>): Category {
        return this.getCategory(category) ?? category
    }

    static async searchCategory(category: string, setVModel: Function): Promise<IOption[]> {
        const categoryToLowerCase = category.toLowerCase()
        const perfetMatch: Ref<boolean> = ref(false)

        function perfetMatchCallback(item: Category) {
            if (!item.name) { return }
            if (item.name.toLowerCase() === categoryToLowerCase) {
                perfetMatch.value = true
                setVModel(item.id)
            }
        }

        const result = await CategoryRepository.getCategories({ name: category })

        return InputManager.createOptionsFromItems(result.items.value, { callback: perfetMatchCallback })
    }
}