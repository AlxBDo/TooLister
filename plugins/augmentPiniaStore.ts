import type { Pinia, PiniaPluginContext } from "pinia"
import { extendsStore } from "./pinia/extendsStore/extendsStore";
import { itemListStore } from "./pinia/itemListStore";
import { persistStorePlugin } from "./pinia/persistStore";


function augmentPiniaStore(context: PiniaPluginContext) {
    itemListStore(context)
    extendsStore(context)
    persistStorePlugin(context)
}

export default defineNuxtPlugin({
    name: 'augmentPiniaStore',
    async setup({ $pinia }) {
        ($pinia as Pinia).use(augmentPiniaStore)
    }
})