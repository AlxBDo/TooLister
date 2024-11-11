import type { IAnyObject } from "~/types"

export const itemsAreEmpty = (state: IAnyObject) => state?.items && state.items.length === 0