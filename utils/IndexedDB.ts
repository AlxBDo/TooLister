
interface ObjectStoreCreationOptions {
    autoIncrement?: boolean
    keyPath?: string
}

interface IOnRequestCallbackParamsProperties {
    callback?: Function
    message?: string
    data?: any
}

type TEventFunction = (event?: any) => void

interface IOnRequestCallbackParams {
    error?: TEventFunction
    success?: TEventFunction
    upgrade?: TEventFunction
}

type ObjectItemKey = string | number


export default class IndexedDB {
    private _db?: IDBDatabase
    private _name: string = 'appListDB'
    private _objectStore?: IDBObjectStore
    private _objectStoreOptions?: ObjectStoreCreationOptions = {
        keyPath: 'id'
    }
    private _objectStoreName: string
    private _transactionMode: IDBTransactionMode = 'readwrite'
    private _version: number = 3

    constructor(
        objectStoreName: string,
        objectStoreCreationOptions?: ObjectStoreCreationOptions,
        transactionMode?: IDBTransactionMode
    ) {
        this._objectStoreName = objectStoreName

        if (objectStoreCreationOptions) {
            this._objectStoreOptions = objectStoreCreationOptions
        }

        if (transactionMode) {
            this._transactionMode = transactionMode
        }
    }

    public clear(): void {
        const success = () => {
            if (this._objectStore) {
                const clearRequest = this._objectStore.clear()

                this.requestEventsHandler(clearRequest, {
                    error: () => this.onError(clearRequest.error)
                })
            }
        }

        this.open({ success })
    }

    public deleteObjectStore(): void {
        const success = () => {
            this._db?.deleteObjectStore(this._objectStoreName)
        }

        this.open({ success })
    }

    public async getItem(key: ObjectItemKey): Promise<Object> {
        return new Promise((resolve, reject) => {
            const success = () => {
                if (this._objectStore) {
                    const itemRequest = this._objectStore.get(key)

                    this.requestEventsHandler(itemRequest, {
                        error: () =>
                            this.onError(itemRequest.error, () =>
                                reject(itemRequest.error)
                            ),
                        success: () => resolve(itemRequest.result)
                    })
                }
            }

            this.open({ success })
        })
    }

    public async getObjectStoreItem(
        indexName: string,
        indexValue: string | number
    ): Promise<Object> {
        return new Promise((resolve, reject) => {
            const success = () => {
                if (this._objectStore) {
                    const index = this._objectStore.index(indexName)
                    const indexRequest = index.get(indexValue)

                    this.requestEventsHandler(indexRequest, {
                        error: () => reject(indexRequest.error),
                        success: () => resolve(indexRequest.result)
                    })
                }
            }
            this.open({ success })
        })
    }

    private onError(error: any, callback?: Function): void {
        console.log('IndexDB ERROR', error)
        callback && callback()
    }

    private onSuccess(callback: Function, data?: any): void {
        callback(data)
    }

    private open(eventCallback?: IOnRequestCallbackParams) {
        const request = indexedDB.open(this._name, this._version)

        const setDb = () => {
            this._db = request.result
        }

        if (eventCallback?.success) {
            const successCallback = eventCallback.success
            eventCallback.success = () => {
                setDb()

                if (!this._db) {
                    return
                }

                const transaction = this._db.transaction(
                    this._objectStoreName,
                    this._transactionMode
                )

                transaction.onerror = () => this.onError(transaction.error)

                this._objectStore = transaction.objectStore(
                    this._objectStoreName
                )

                if (this._objectStore) {
                    successCallback()
                }
            }
        }

        if (eventCallback?.upgrade) {
            const upgradeCallback = eventCallback.upgrade
            eventCallback.upgrade = () => {
                setDb()
                upgradeCallback()
            }
        }

        const error = () => {
            this.onError(request.error, eventCallback?.error)
        }

        eventCallback && this.openRequestEventsHandler(request, { ...eventCallback, error })

        return request
    }

    public removeItem(key: ObjectItemKey): void {
        const success = () => {
            if (this._objectStore) {
                const deleteRequest = this._objectStore.delete(key)
                this.removeItemRetunFunctions(deleteRequest, key as string)
            }
        }

        this.open({ success })
    }

    private removeItemRetunFunctions(deleteRequest: IDBRequest, key: string) {
        deleteRequest.onerror = () =>
            console.log(`Item "${key}" remove`, deleteRequest.error)
    }

    public removeItems(excludedItems?: any[]): void {
        const success = () => {
            if (this._objectStore) {
                const getAllRequest = this._objectStore.getAllKeys()

                const success = () => {
                    const items = getAllRequest.result

                    items.forEach((key) => {
                        if (
                            this._objectStore &&
                            (!excludedItems || !excludedItems.includes(key))
                        ) {
                            const deleteRequest = this._objectStore.delete(key)
                            this.removeItemRetunFunctions(
                                deleteRequest,
                                key as string
                            )
                        }
                    })
                }

                const error = () =>
                    console.log('removeItems', [getAllRequest.error])

                this.requestEventsHandler(getAllRequest, { error, success })
            }
        }

        this.open({ success })
    }

    private requestEventsHandler(
        request: IDBOpenDBRequest | IDBRequest,
        params: IOnRequestCallbackParams
    ): void {
        const { error, success } = params
        if (error) {
            request.onerror = error
        }
        if (success) {
            request.onsuccess = success
        }
    }

    private openRequestEventsHandler(
        request: IDBOpenDBRequest,
        params: IOnRequestCallbackParams
    ): void {
        this.requestEventsHandler(request, params)
        if (params.upgrade) {
            request.onupgradeneeded = params.upgrade
        }
    }

    public setItem(item: Object, index?: string[]): void {
        const success = () => {
            if (this._objectStore) {
                const addRequest = this._objectStore.add(item)
                if (index) {
                    const success = () => {
                        index.forEach((i) => {
                            this._objectStore?.createIndex(i, i, {
                                unique: true
                            })
                            console.log(`"${i}" index created`)
                        })
                    }

                    const error = () => this.onError(addRequest.error)
                    this.requestEventsHandler(addRequest, { error, success })
                }
            }
        }

        const upgrade = () => {
            if (this._db) {
                if (!this._db.objectStoreNames.contains(this._name)) {
                    this._db.createObjectStore(
                        this._objectStoreName,
                        this._objectStoreOptions
                    )
                }
            }
        }

        this.open({ success, upgrade })
    }

    public updateItem(item: Object): void {
        const success = () => {
            if (this._objectStore) {
                const addRequest = this._objectStore.put(item)
                addRequest.onerror = () =>
                    console.log('update item', addRequest.error, item)
            }
        }

        this.open({ success })
    }
}
