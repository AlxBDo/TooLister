import type { TListTypes } from "~/types/list";
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
