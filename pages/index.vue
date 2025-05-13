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
    <div class="pt-4 flex items-center justify-center">
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded-md shadow active:bg-blue-700 transition-colors duration-200"
        @click="startRecording"
      >
        録音開始
      </button>
    </div>
    <div class="pt-4 flex justify-center space-x-4">
      <div class="flex items-center justify-center">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md shadow active:bg-blue-700 transition-colors duration-200"
          @click="startSpeechRecognition"
        >
          音声認識開始
        </button>
      </div>
      <div class="flex items-center justify-center">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md shadow active:bg-blue-700 transition-colors duration-200"
          @click="stopSpeechRecognition"
        >
          音声認識停止
        </button>
      </div>
    </div>
    <div class="pt-4 flex items-center justify-center">
      {{ speechRecognitionStore.fullResultText }}
    </div>
  </div>
</template>

<script setup lang="ts">
enum OBJECT_STORE_NAME {
  RECORDED_DATA = 'recorded_data',
}

// 録音許可処理
const displayMessage = ref('')
// Edgeブラウザの設定URL
const EDGE_BROWSE_SETTING_URL = 'edge://settings/content/microphone'

let stream: MediaStream | null = null

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
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
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

// 録音処理
const startRecording = async () => {
  const indexedDBStore = useIndexedDBStore()
  try {
    // const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream as MediaStream)
    const chunks: Blob[] = []

    // 利用可能なMIMEタイプを確認
    console.log('audio/webm;codecs=opus:', MediaRecorder.isTypeSupported('audio/webm;codecs=opus'))
    console.log('audio/webm:', MediaRecorder.isTypeSupported('audio/webm'))
    console.log('audio/webm;codecs=pcm:', MediaRecorder.isTypeSupported('audio/webm;codecs=pcm'))
    console.log('audio/ogg:', MediaRecorder.isTypeSupported('audio/ogg'))
    console.log('audio/mp4:', MediaRecorder.isTypeSupported('audio/mp4'))
    console.log('audio/mpeg:', MediaRecorder.isTypeSupported('audio/mpeg'))
    console.log('audio/aac:', MediaRecorder.isTypeSupported('audio/aac'))
    console.log('audio/wav:', MediaRecorder.isTypeSupported('audio/wav'))
    console.log('audio/flac:', MediaRecorder.isTypeSupported('audio/flac'))
    console.log('audio/x-aiff:', MediaRecorder.isTypeSupported('audio/x-aiff'))
    console.log('audio/vnd.rn-realaudio:', MediaRecorder.isTypeSupported('audio/vnd.rn-realaudio'))

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data)
      }
    }

    recorder.onstop = async () => {
      // audio/webm;codecs=opus
      // audio/webm;codecs=pcm
      // audio/webm
      const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' })
      console.log('録音完了:', blob)

      // テスト：録音データを再生
      // const audioUrl = URL.createObjectURL(blob)
      // const audio = new Audio(audioUrl)
      // audio.play()

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
        blob: blob, // ここが録音データ本体
      }

      // データ登録
      recordedDataStore.add(record)

      // データ取得し、再生する
      // alert('audio/webmの録音を再生します。')
      // await recordedDataPlay(6)
      // alert('audio/webm;codecs=opusの録音を再生します')
      // await recordedDataPlay(8)
      // alert('audio/webm;codecs=pcmの録音を再生します')
      // await recordedDataPlay(15)
    }

    alert('録音を開始します。')
    // テスト：録音開始
    recorder.start()
    console.log('録音開始')
    // 5秒後に停止（自動停止の例）
    setTimeout(() => recorder.stop(), 5000)
  }
  catch (err) {
    console.error('録音に失敗しました:', err)
  }
}

const speechRecognitionStore = useSpeechRecognitionStore()

// 音声認識処理
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
</script>

<style scoped>
.message-box {
    white-space: pre-wrap; /* 改行文字を反映 */
}
</style>
