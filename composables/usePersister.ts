import type { Store } from "pinia"
import IndexedDB from "~/utils/IndexedDB"

interface IStore {
    storeName: string;
    store: Store
}

type TIndexedDBMethods = 'setItem' | 'updateItem'

export default () => {
    const stores: IStore[] = []
    const dbName = "persister"
    const dbOptions = { keyPath: 'storeName' }

    const clear = () => {
        const db = new IndexedDB(dbName, dbOptions)
        db.removeItems()
        stores.splice(0, stores.length)
    }

    const getItem = async (itemKey: string, db?: IndexedDB): Promise<any> => {
        if (!db) { db = new IndexedDB(dbName, dbOptions) }

        if (!db) { return false }

        return await db.getItem(itemKey)
    }

    const removeItem = async (itemKey: string) => {
        const db = new IndexedDB(dbName, dbOptions)
        db.removeItem(itemKey)
    }


    const setItem = async (key: string, item: any) => {
        const db = new IndexedDB(dbName, dbOptions)

        const isExist = await getItem(key, db)
        let operation: TIndexedDBMethods = isExist ? 'updateItem' : 'setItem'

        db[operation]({ ...item, storeName: key })
    }

    return { clear, getItem, removeItem, setItem }
}