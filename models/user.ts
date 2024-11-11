import type { Item } from "../models/item";

export interface User extends Item {
  firstname?: string;
  email?: string;
  listes?: any;
  password?: string;
  roles?: string;
  sharedLists?: any;
  userIdentifier?: string;
  username?: string;
  salt?: string;
}
