




const pIndexedDB = (name, keyPath, indexes = []) => {
    return new Promise((resolve) => {

        const DBOpenRequest = window.indexedDB.open(name)

        DBOpenRequest.onerror = (e) => { resolve() }

        DBOpenRequest.onsuccess = (e) => {
            const db = DBOpenRequest.result
            resolve(initGetAddRemove(db))
        }

        // if the db is not init (or version upgrade)
        DBOpenRequest.onupgradeneeded = (e) => {
            const db = e.target.result

            db.onerror = () => { resolve() }// Error loading database      

            // create "table", keyPath = primary key
            const objectStore = db.createObjectStore(name, { keyPath: keyPath })
            for (const index of indexes) {
                objectStore.createIndex(index, index, { unique: false })
            }
        }

        // what we resolve when indexedDB is ready
        const initGetAddRemove = (db) => {

            // for all functions, resolve undefined if nothing or fail

            return {
                add: (newItem) => {
                    return new Promise((resolve) => {
                        let result
                        const transaction = db.transaction([name], "readwrite")
                        transaction.oncomplete = () => { resolve(result) }
                        transaction.onerror = () => { resolve() }
                        transaction.onabort = () => { resolve() }
                        const objectStore = transaction.objectStore(name)
                        const req = objectStore.add(newItem)
                        req.onsuccess = () => { result = true }
                    })
                },
                get: (key) => {
                    return new Promise((resolve) => {
                        const transaction = db.transaction([name], "readwrite")
                        transaction.oncomplete = () => { resolve(req.result) }
                        transaction.onerror = () => { resolve() }
                        transaction.onabort = () => { resolve() }
                        const objectStore = transaction.objectStore(name)
                        const req = objectStore.get(key)
                    })
                },
                delete: (key) => {
                    return new Promise((resolve) => {
                        let result
                        const transaction = db.transaction([name], "readwrite")
                        transaction.oncomplete = () => { resolve(result) }
                        transaction.onerror = () => { resolve() }
                        transaction.onabort = () => { resolve() }
                        const objectStore = transaction.objectStore(name)
                        const req = objectStore.delete(key)
                        req.onsuccess = () => { result = true }
                    })
                }
            }
        }
    })
}

(async () => {
    // init db
    const db = await pIndexedDB('storage', 'yepKey', ['blob'])
    if (!db) return

    // example of adding data
    await db.add({ yepKey: 'blob', blob: new Blob(['y', 'e', 'p']) })

    // example of getting data
    let data = await db.get('blob')
    console.log(data)

    // handle if no data
    if (data) {
        console.log('blob text is: ' + await data.blob.text())
    } else {
        // data = await fetch('./binary51') or default data or what you want
    }

    await db.delete('yepKey')
    console.log(await db.get('yepKey'))
})()
