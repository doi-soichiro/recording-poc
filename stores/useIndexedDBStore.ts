import { defineStore } from 'pinia'

enum OBJECT_STORE_NAME {
  RECORDED_DATA = 'recorded_data',
}

export const useIndexedDBStore = defineStore('indexedDBStore', () => {
  const request = indexedDB.open('careDatabase', 1)
  let db: IDBDatabase | null = null

  // データベース情報の初期化
  const init = async (): Promise<void> => {
    if (db) return
    // データベース新規作成時、バージョン更新時の処理
    request.onupgradeneeded = () => {
      console.log('onupgradeneeded')
      const db = request.result
      // 録音データのオブジェクトストアを作成
      db.createObjectStore(OBJECT_STORE_NAME.RECORDED_DATA, { keyPath: 'id', autoIncrement: true })
    }

    db = await new Promise((resolve, reject) => {
      // データベースのオープン処理
      request.onsuccess = () => {
        resolve(request.result)
        console.log('IndexedDBのオープンに成功しました')
      }
      // オープン失敗時の処理
      request.onerror = (event) => {
        reject(request.error)
        console.error('IndexedDBのオープンに失敗しました', event)
      }
    })
  }

  // データベースの取得処理
  const getDB = (): IDBDatabase => {
    if (!db) throw new Error('DB未初期化です。init()を呼び出してください。')
    return db
  }
  return { init, getDB }
})
