// stores/useSpeechRecognitionStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 音声認識処理を管理するストア
// NOTE: 当ストアで利用する型定義は、~/types/speech-recognition.d.tsにする
export const useSpeechRecognitionStore = defineStore('speechRecognitionStore', () => {
  const speechRecognitionStatus = ref('未開始')
  const fullResultText = ref('') // 音声認識結果テキスト（全文）
  const interimText = ref('') // 音声認識中間結果テキスト

  let speechRecognizer: SpeechRecognition | null = null // 音声認識インスタンス
  let isSpeaking = false // 音声認識中フラグ
  let shouldContinueRecognition = true // 音声認識の継続制御フラグ

  // インスタンス作成
  const createSpeechRecognizerInstance = (): SpeechRecognition => {
    const SpeechRecognitionClass = (
      window.SpeechRecognition ?? window.webkitSpeechRecognition
    ) as new () => SpeechRecognition
    const recognizer = new SpeechRecognitionClass()

    recognizer.lang = 'ja-JP'
    recognizer.interimResults = true
    recognizer.continuous = true

    recognizer.onsoundstart = () => {
      speechRecognitionStatus.value = '認識中'
    }

    recognizer.onsoundend = () => {
      speechRecognitionStatus.value = '停止中'
      continueRecognition()
    }

    recognizer.onerror = () => {
      speechRecognitionStatus.value = 'エラー'
      if (!isSpeaking) continueRecognition()
    }

    recognizer.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results
      for (let i = event.resultIndex; i < results.length; i++) {
        const text = results[i][0].transcript
        console.log('音声認識中:', text)
        if (results[i].isFinal) {
          fullResultText.value += `${text}\n`
          isSpeaking = false
          interimText.value = ''
          continueRecognition()
        }
        else {
          interimText.value = text
          isSpeaking = true
        }
      }
    }

    return recognizer
  }

  // 音声認識の開始処理
  const startRecognition = () => {
    shouldContinueRecognition = true
    if (speechRecognizer) speechRecognizer.abort()
    speechRecognizer = createSpeechRecognizerInstance()
    speechRecognitionStatus.value = '起動中'
    if (speechRecognizer) speechRecognizer.start()
    console.log('音声認識開始')
  }

  // 音声認識の停止処理
  const stopRecognition = (): Promise<void> => {
    return new Promise((resolve) => {
      shouldContinueRecognition = false

      if (speechRecognizer) {
      // 音声認識の終了を検知する
        speechRecognizer.onend = () => {
          speechRecognitionStatus.value = '停止'
          console.log('音声認識が終了しました')
          resolve()
        }

        speechRecognizer.stop()
      }
      else {
        resolve()
      }
    })
  }

  // 音声認識の終了・継続処理
  const continueRecognition = () => {
    // 音声認識を終了する場合は再起動しない
    if (!shouldContinueRecognition) {
      console.log('音声認識停止')
      return
    }
    if (speechRecognizer) {
      speechRecognizer.abort()
    }
    speechRecognizer = createSpeechRecognizerInstance()
    if (speechRecognizer) speechRecognizer.start()
  }

  // 音声認識結果テキストの取得
  const getFullResultText = (): string => {
    return fullResultText.value
  }

  return {
    getFullResultText,
    interimText,
    speechRecognitionStatus,
    startRecognition,
    stopRecognition,
  }
})
