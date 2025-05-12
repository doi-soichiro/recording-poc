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
    <div class="pt-4 flex items-center justify-center">
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded-md shadow active:bg-blue-700 transition-colors duration-200"
        @click="startRecognition"
      >
        音声認識開始
      </button>
    </div>
    <div class="pt-4 flex items-center justify-center">
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded-md shadow active:bg-blue-700 transition-colors duration-200"
        @click="stopRecognition"
      >
        音声認識停止
      </button>
    </div>
    <div class="pt-4 flex items-center justify-center">
      {{ transcriptText }}
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

// 録音データの再生処理
const transcriptText = ref('')
const liveText = ref('')
const voiceRecordStatus = ref('未開始')
const isRecognizing = ref(false)
let shouldRestartRecognition = true // 自動再開フラグ

let recognition: any = null
let flagSpeaking = false

const createRecognitionInstance = (): any => {
  const SpeechRecognitionClass
    = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  const recognizer = new SpeechRecognitionClass()

  recognizer.lang = 'ja-JP'
  recognizer.interimResults = true
  recognizer.continuous = true

  recognizer.onsoundstart = () => {
    voiceRecordStatus.value = '認識中'
  }

  recognizer.onsoundend = () => {
    voiceRecordStatus.value = '停止中'
    restartRecognition()
  }

  recognizer.onerror = () => {
    voiceRecordStatus.value = 'エラー'
    if (!flagSpeaking) restartRecognition()
  }

  recognizer.onresult = (event: any) => {
    const results = event.results
    for (let i = event.resultIndex; i < results.length; i++) {
      const text = results[i][0].transcript
      console.log('音声認識中:', text)
      if (results[i].isFinal) {
        transcriptText.value += `${text}\n`
        flagSpeaking = false
        liveText.value = ''
        restartRecognition()
      }
      else {
        liveText.value = text
        flagSpeaking = true
      }
    }
  }
  return recognizer
}

const startRecognition = () => {
  shouldRestartRecognition = true

  if (recognition) recognition.abort()
  recognition = createRecognitionInstance()
  isRecognizing.value = true
  voiceRecordStatus.value = '開始'
  recognition.start()
  console.log('音声認識開始')
}

const stopRecognition = () => {
  if (recognition) {
    shouldRestartRecognition = false // 👈 自動再開禁止
    recognition.stop()
    voiceRecordStatus.value = '停止'
    isRecognizing.value = false
  }
}

const restartRecognition = () => {
  if (!shouldRestartRecognition) return

  if (recognition) {
    recognition.abort()
    recognition = createRecognitionInstance()
    recognition.start()
  }
}
</script>

<style scoped>
.message-box {
    white-space: pre-wrap; /* 改行文字を反映 */
}
</style>
