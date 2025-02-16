import type { PiniaPluginContext } from "pinia";


export function isOptionApi({ store }: PiniaPluginContext): boolean {
    return store._isOptionsAPI
}