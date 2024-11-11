import type { ShoppingItem } from "./shoppingitem";

export interface GiftItem extends ShoppingItem {
  buyers?: any;
  preferenceOrder?: number;
}
