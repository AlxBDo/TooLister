import type { TListTypes, TListTypesMap } from "~/types/list";
import type { Item } from "./item";
import type { TListItem } from "~/managers/ListItemForm";


export interface Liste extends Item {
  guest?: any;
  name?: string;
  owner?: any;
  type?: TListTypes;
  selectedItems?: TListItem[];
  items?: TListItem[];
  unselectedItems?: TListItem[];
}


export const TYPE_COLLECTION: string = "collection"
export const TYPE_GIFT: string = "gift"
export const TYPE_MAINTEANCE: string = "maintenance"
export const TYPE_RECIPE: string = "recipe"
export const TYPE_SHOPPING: string = "shopping"
export const TYPE_TASK: string = "task"
export const LIST_TYPES: TListTypesMap = {
  "0": TYPE_COLLECTION,
  "1": TYPE_GIFT,
  "2": TYPE_MAINTEANCE,
  "3": TYPE_RECIPE,
  "4": TYPE_SHOPPING,
  "5": TYPE_TASK,
}
