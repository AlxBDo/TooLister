import type { Item } from "./item";
import type { TListItem } from "~/managers/ListItemForm";

export interface Liste extends Item {
  guest?: any;
  name?: string;
  owner?: any;
  type?: string;
  selectedItems?: TListItem[];
  items?: TListItem[];
  unselectedItems?: TListItem[];
}
