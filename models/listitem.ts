import type { Category } from "./category";
import type { IAnyObject } from "~/types";
import type { Item } from "./item";

export interface ListItem extends Item, IAnyObject {
  category?: Category | string;
  description?: string;
  list?: any;
  name?: string;
  status?: number;
  url?: string;
}
