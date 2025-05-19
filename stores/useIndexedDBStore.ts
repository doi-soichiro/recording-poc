import { defineStore } from 'pinia'

enum OBJECT_STORE_NAME {
  RECORDED_DATA = 'recorded_data',
}

export const useIndexedDBStore = defineStore('indexedDBStore', () => {
  const request = indexedDB.open('careDatabase', 1) // オブジェクトストア構造を更新する場合、バージョンの数値を上げていく(小数は非対応)
  let db: IDBDatabase | null = null

  // データベース情報の初期化
  const init = async (): Promise<void> => {
    if (db) return
    // データベース新規作成時、バージョン更新時の処理
    request.onupgradeneeded = () => {
      console.log('onupgradeneeded')
      const db = request.result
      // 旧オブジェクトストアが存在する場合は削除（全データが削除される）
      if (db.objectStoreNames.contains('recorded_data')) {
        db.deleteObjectStore('recorded_data')
      }
      // 録音データのオブジェクトストアを作成
      db.createObjectStore(OBJECT_STORE_NAME.RECORDED_DATA, { keyPath: 'minutesId' })
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
