import type { Pinia, PiniaPluginContext } from "pinia"
import { extendsStore } from "./pinia/extendsStore/extendsStore";
import { itemListStore } from "./pinia/itemListStore";
import { persistStore } from "./pinia/persistStore";


function extendsPiniaStore(context: PiniaPluginContext) {
    itemListStore(context)
    extendsStore(context)
    persistStore(context)
}

export default defineNuxtPlugin({
    name: 'extendsPiniaStore',
    async setup({ $pinia }) {
        ($pinia as Pinia).use(extendsPiniaStore)
    }
})