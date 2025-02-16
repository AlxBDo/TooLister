import type { Contact } from "./contact";

export interface User extends Contact {
  listes?: any;
  password?: string;
  roles?: string;
  sharedLists?: any;
  userIdentifier?: string;
  username?: string;
  salt?: string;
}
