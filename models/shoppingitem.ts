import type { ListItem } from "./listitem";

export interface ShoppingItem extends ListItem {
  price?: number;
  quantity?: number;
  quantityUnit?: number;
}
