<template>
  <div class="relative min-w-screen min-h-screen pt-4 flex flex-col font-mono">
    <div class="flex items-center justify-center">
      ようこそ！録音アプリへ
    </div>
    <div class="pt-4 flex items-center justify-center">
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded-md shadow active:bg-blue-700 transition-colors duration-200"
        @click="requestMicrophonePermission"
      >
        録音許可
      </button>
    </div>
    <div
      class="pt-4 flex items-center justify-center message-box"
      @click="copyToClipboard"
    >
      {{ displayMessage }}
    </div>
    <div class="pt-4 flex justify-center space-x-4">
      <div class="flex items-center justify-center">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md shadow active:bg-blue-700 transition-colors duration-200"
          @click="startRecording"
        >
          録音のみ開始
        </button>
      </div>
      <div class="flex items-center justify-center">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md shadow active:bg-blue-700 transition-colors duration-200"
          @click="stopRecording"
        >
          録音のみ停止
        </button>
      </div>
    </div>
    <div class="pt-4 flex justify-center space-x-4">
      <div class="flex items-center justify-center">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md shadow active:bg-blue-700 transition-colors duration-200"
          @click="startSpeechRecognition"
        >
          音声認識のみ開始
        </button>
      </div>
      <div class="flex items-center justify-center">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md shadow active:bg-blue-700 transition-colors duration-200"
          @click="stopSpeechRecognition"
        >
          音声認識のみ停止
        </button>
      </div>
    </div>
    <div class="pt-4 flex justify-center space-x-4">
      <div class="flex items-center justify-center">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md shadow active:bg-blue-700 transition-colors duration-200"
          @click="startCareRecording"
        >
          録音・音声認識開始
        </button>
      </div>
      <div class="flex items-center justify-center">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md shadow active:bg-blue-700 transition-colors duration-200"
          @click="stopCareRecording"
        >
          録音・音声認識停止
        </button>
      </div>
    </div>
    <div class="pt-4 flex items-center justify-center">
      {{ speechRecognitionStore.getFullResultText() }}
    </div>
    <div class="pt-4 flex justify-center space-x-4">
      <div class="flex items-center justify-center">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md shadow active:bg-blue-700 transition-colors duration-200"
          @click="uploadRecordedZip"
        >
          録音・音声認識zipをアップロード
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import JSZip from 'jszip'

import { getRandomInt } from '~/utils/randomInt'

enum OBJECT_STORE_NAME {
  RECORDED_DATA = 'recorded_data',
}

// 録音許可処理
const displayMessage = ref('')
// Edgeブラウザの設定URL
const EDGE_BROWSE_SETTING_URL = 'edge://settings/content/microphone'

const requestMicrophonePermission = async () => {
  try {
    // マイク利用許可状態を確認
    const microphoneStatus = await navigator.permissions.query({ name: 'microphone' })
    switch (microphoneStatus.state) {
      case 'granted':
        console.log('マイクの使用が許可されています。')
        displayMessage.value = '録音可能な状態です。'
        break
      case 'prompt':
        console.log('マイクの使用が許可されていません。')
        displayMessage.value = '施術中の録音機能を有効にするため、\nマイクへのアクセスを「許可」してください。'
        break
      case 'denied':
        console.log('マイクの使用が拒否されています。')
        // alert('マイクの使用が拒否されているため、施術中の録音機能は使用できません。\nブラウザの設定からマイクへのアクセスを許可してください。\n\n設定画面はこちら→edge://settings/content/microphone');
        displayMessage.value
                    = 'マイクの使用が拒否されているため、施術中の録音機能は使用できません。\n'
                      + 'ブラウザの設定からマイクへのアクセスを許可してください。\n\n'
                      + 'タップして設定画面へのリンクをコピーできます。\n'
                      + 'edge://settings/content/microphone'
        break
    }

    // TODO: MediaStreamStoreを作成して、streamを再利用するようにする
    await navigator.mediaDevices.getUserMedia({ audio: true })
  }
  catch (err) {
    // マイク利用許可が得られなかった場合「NotAllowedError: Permission denied」
    if (err.name === 'NotAllowedError') {
      console.error('マイク利用が拒否されました。', err)
    }
  }
}

// クリップボードにコピーする処理
const copyToClipboard = async () => {
  // マイク利用許可状態を確認
  const microphoneStatus = await navigator.permissions.query({ name: 'microphone' })
  if (displayMessage.value && microphoneStatus.state === 'denied') {
    navigator.clipboard.writeText(EDGE_BROWSE_SETTING_URL)
      .then(() => {
        console.log('コピーしました:', displayMessage.value)
        alert('URLをコピーしました！')
      })
      .catch((err) => {
        console.error('コピーに失敗しました:', err)
      })
  }
}

const recorderStore = useRecorderStore()

const startRecording = async () => {
  await recorderStore.startRecording()
}

const stopRecording = async () => {
  const blob = await recorderStore.stopRecording()
  if (blob) {
    console.log('録音データあり:', blob)
    // 再生 or 保存処理などへ
  }
}

const speechRecognitionStore = useSpeechRecognitionStore()

// 音声認識開始処理
const startSpeechRecognition = async () => {
  try {
    await speechRecognitionStore.startRecognition()
  }
  catch (error) {
    console.error('音声認識の開始に失敗:', error)
  }
}

// 音声認識停止処理
const stopSpeechRecognition = async () => {
  try {
    await speechRecognitionStore.stopRecognition()
  }
  catch (error) {
    console.error('音声認識の停止に失敗:', error)
  }
}

// 録音・音声認識開始処理
const startCareRecording = async () => {
  await recorderStore.startRecording()
  await speechRecognitionStore.startRecognition()

  // 1分後に停止処理を実行
  // setTimeout(async () => {
  //   await stopCareRecording()
  // }, 60 * 1000)
}

// 録音・音声認識停止処理
const stopCareRecording = async () => {
  await recorderStore.stopRecording()
  await speechRecognitionStore.stopRecognition()

  // 録音データを取得
  const recordedBlob = recorderStore.getRecordedBlob() as Blob
  // 音声認識テキストを取得
  const fullResultText = speechRecognitionStore.getFullResultText()
  // 録音データ、音声認識テキストが取得できなかった場合、処理を終了
  if (!recordedBlob && !fullResultText) {
    console.log('録音データ、音声認識テキストが取得できませんでした。')
    return
  }
  console.log('音声認識テキスト:', fullResultText)

  // テスト：形式毎の録音データサイズを確認
  const getRecordedBlob = await recorderStore.getRecordedBlob() as Blob
  checkSize(getRecordedBlob, RECORDED_DATA_MIME_TYPE)

  // zip化処理
  const recordedZipBlob = await createZipFromRecording(recordedBlob, fullResultText)
  // テスト：zipの中身をログ出力
  // await inspectZipBlob(zipBlob)
  // indexedDBにzipを保存
  saveRecordedZip(recordedZipBlob as Blob)

  // TODO: zipをサーバーにアップロードする処理を実装する
}

// 録音データのサイズを確認する処理
const checkSize = async (blob: Blob, type: string) => {
  console.log('録音データのサイズ確認:', type, '-----------------------------------------------')
  console.log('サイズ (バイト):', blob.size)
  console.log('サイズ (KB):', `${(blob.size / 1024).toFixed(2)} KB`)
  console.log('サイズ (MB):', `${(blob.size / 1024 / 1024).toFixed(2)} MB`)
}

// 録音データ、音声認識テキストをそれぞれindexedDBに保存する処理
const saveRecordedData = async (recordedBlob: Blob, fullResultText: string) => {
  const indexedDBStore = useIndexedDBStore()
  try {
    // indexedDB接続成功後、トランザクション処理を実行することができる
    const transaction = indexedDBStore.getDB().transaction(OBJECT_STORE_NAME.RECORDED_DATA, 'readwrite')
    const recordedDataStore = transaction.objectStore(OBJECT_STORE_NAME.RECORDED_DATA)
    // トランザクション処理成功時の処理
    transaction.oncomplete = () => {
      console.log('データの登録が成功しました')
    }
    // トランザクション処理エラー時の処理
    transaction.onerror = () => {
      console.error('データの登録が失敗しました。:', transaction.error)
    }

    const record = {
      customerName: '録音ユーザーA', // 任意の名前（不要なら削除可）
      recordedAt: new Date().toISOString(), // 日時などのメタ情報
      recordedBlob: recordedBlob, // 録音データ本体
      recordedText: fullResultText, // 音声認識テキスト
    }

    // データ登録
    recordedDataStore.add(record)
  }
  catch (err) {
    console.error('録音データ、音声認識テキストの保存に失敗:', err)
  }
}

// zipデータをindexedDBに保存する処理
const saveRecordedZip = async (recordedZipBlob: Blob) => {
  const indexedDBStore = useIndexedDBStore()
  try {
    // indexedDB接続成功後、トランザクション処理を実行することができる
    const transaction = indexedDBStore.getDB().transaction(OBJECT_STORE_NAME.RECORDED_DATA, 'readwrite')
    const recordedDataStore = transaction.objectStore(OBJECT_STORE_NAME.RECORDED_DATA)
    // トランザクション処理成功時の処理
    transaction.oncomplete = () => {
      console.log('データの登録が成功しました')
    }
    // トランザクション処理エラー時の処理
    transaction.onerror = () => {
      console.error('データの登録が失敗しました。:', transaction.error)
    }

    const record = {
      customerName: '録音ユーザーA', // ユーザ名
      recordedAt: new Date().toISOString(), // 登録日時
      recordedZipBlob: recordedZipBlob, // 録音・音声認識を格納したzip本体
      isUploaded: false, // アップロード済みフラグ
    }

    // データ登録
    recordedDataStore.add(record)
  }
  catch (err) {
    console.error('録音データ、音声認識テキストの保存に失敗:', err)
  }
}

// zip化処理
const createZipFromRecording = async (audioBlob: Blob, fullResultText: string): Promise<Blob> => {
  const zip = new JSZip()

  // minutes_idを想定した値を取得
  const minutesId = `minutes${getRandomInt(10000, 99999)}`

  // 録音ファイルを追加
  zip.file(`${minutesId}.webm`, audioBlob)
  // 音声認識ファイルを追加
  zip.file(`${minutesId}.txt`, fullResultText)

  // zipをBlobで出力
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  return zipBlob
}

// zipの中身をログ出力する処理
const inspectZipBlob = async (zipBlob: Blob) => {
  const zip = await JSZip.loadAsync(zipBlob)

  console.log('ZIP内のファイル一覧:')
  for (const filename of Object.keys(zip.files)) {
    console.log(`- ${filename}`)

    const file = zip.files[filename]

    if (filename.endsWith('.txt')) {
      const content = await file.async('string')
      console.log(`${filename} の内容:`)
      console.log(content)
    }

    if (filename.endsWith('.webm')) {
      const blob = await file.async('blob')
      console.log(`${filename} のサイズ: ${blob.size} bytes`)
      console.log(`Blobの中身:`, blob)
    }
  }
}
</script>

<style scoped>
.message-box {
    white-space: pre-wrap; /* 改行文字を反映 */
}
</style>
