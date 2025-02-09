interface ObjectStoreCreationOptions {
    autoIncrement?: boolean
    keyPath?: string
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
    private _localStorageVersionKey: string = 'IDBVersion'
    private _name: string = 'appListDB'
    private _objectStore?: IDBObjectStore
    private _objectStoreOptions?: ObjectStoreCreationOptions = {
        keyPath: 'id'
    }
    private _objectStoreName: string
    private _transactionMode: IDBTransactionMode = 'readwrite'
    private _version: number

    constructor(
        objectStoreName: string,
        objectStoreCreationOptions?: ObjectStoreCreationOptions,
        transactionMode?: IDBTransactionMode
    ) {
        this._objectStoreName = objectStoreName

        this._version = this.getStoredVersionNumber()

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

    private createObjectStore(): void {
        if (this._db && !this._db.objectStoreNames.contains(this._name)) {
            this._db.createObjectStore(this._objectStoreName, this._objectStoreOptions);
        }
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

            this.open({ success });
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

    private getStoredVersionNumber(): number {
        if (!localStorage) { return 1 }

        const version = localStorage.getItem(this._localStorageVersionKey)
        return version ? parseInt(version) : 1
    }

    private onError(error: any, callback?: Function): void {
        console.log('IndexDB ERROR', error)
        callback && callback(error)
    }

    private open(eventCallback?: IOnRequestCallbackParams): IDBOpenDBRequest {
        const request = indexedDB.open(this._name, this._version);

        const setDb = () => {
            this._db = request.result;
        };

        const handleSuccess = (successCallback: () => void) => {
            try {
                setDb();

                if (!this._db) return;

                const transaction = this._db.transaction(this._objectStoreName, this._transactionMode);

                transaction.onerror = () => this.onError(transaction.error);

                this._objectStore = transaction.objectStore(this._objectStoreName);

                if (this._objectStore) {
                    successCallback();
                }
            } catch (error) {
                useConsole().log('indexedDB open handleSuccess error', [error], { bgColor: 'darkred', icon: '☁️❕' });
            }
        };

        if (eventCallback?.success) {
            const originalSuccessCallback = eventCallback.success;
            eventCallback.success = () => handleSuccess(originalSuccessCallback);
        }

        if (eventCallback?.upgrade) {
            const originalUpgradeCallback = eventCallback.upgrade;
            eventCallback.upgrade = () => {
                setDb();
                originalUpgradeCallback();
            };
        }

        const error = () => {
            const errorCallback = (error: any) => {
                if (error?.name === 'VersionError') {
                    this._version++;
                    this.saveVersion()
                    this.open(eventCallback)
                    return
                }
                eventCallback?.error && eventCallback.error(error);
            }
            this.onError(request.error, errorCallback);
        };

        eventCallback && this.openRequestEventsHandler(request, { ...eventCallback, error });

        return request;
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

    private onSuccess(callback: Function, data?: any): void {
        callback(data)
    }

    public removeItem(key: ObjectItemKey): void {
        const success = () => {
            if (this._objectStore) {
                const deleteRequest = this._objectStore.delete(key);
                this.handleDeleteRequest(deleteRequest, key as string);
            }
        };

        this.open({ success });
    }

    private handleDeleteRequest(deleteRequest: IDBRequest, key: string): void {
        deleteRequest.onerror = () => console.log(`Item "${key}" remove`, deleteRequest.error);
    }

    public removeItems(excludedItems?: any[]): void {
        const success = () => {
            if (this._objectStore) {
                const getAllRequest = this._objectStore.getAllKeys();

                const handleGetAllSuccess = () => {
                    const items = getAllRequest.result;

                    items.forEach((key) => {
                        if (this._objectStore && (!excludedItems || !excludedItems.includes(key))) {
                            const deleteRequest = this._objectStore.delete(key);
                            this.handleDeleteRequest(deleteRequest, key as string);
                        }
                    });
                };

                const error = () => console.log('removeItems', [getAllRequest.error]);

                this.requestEventsHandler(getAllRequest, { error, success: handleGetAllSuccess });
            }
        };

        this.open({ success });
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

    private saveVersion(): void {
        if (!localStorage) { return }
        localStorage.setItem(this._localStorageVersionKey, this._version.toString())
    }

    public setItem(item: Object, index?: string[]): void {
        const success = () => {
            if (this._objectStore) {
                const addRequest = this._objectStore.add(item);
                if (index) {
                    const handleAddSuccess = () => {
                        index.forEach((i) => {
                            this._objectStore?.createIndex(i, i, { unique: true });
                            console.log(`"${i}" index created`);
                        });
                    };

                    const error = () => this.onError(addRequest.error);
                    this.requestEventsHandler(addRequest, { error, success: handleAddSuccess });
                }
            }
        };

        const upgrade = () => this.createObjectStore;

        this.open({ success, upgrade });
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
