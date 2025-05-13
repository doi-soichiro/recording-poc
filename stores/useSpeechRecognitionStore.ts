// stores/useSpeechRecognitionStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 音声認識処理を管理するストア
export const useSpeechRecognitionStore = defineStore('speechRecognitionStore', () => {
  const speechRecognitionStatus = ref('未開始')
  const fullResultText = ref('') // 音声認識結果テキスト（全文）
  const interimText = ref('') // 音声認識中間結果テキスト

  let speechRecognizer: any = null // 音声認識インスタンス
  let isSpeaking = false // 音声認識中フラグ
  let shouldContinueRecognition = true // 音声認識の継続制御フラグ

  // インスタンス作成
  const createSpeechRecognizerInstance = (): any => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
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

    recognizer.onresult = (event: any) => {
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
    speechRecognizer.start()
    console.log('音声認識開始')
  }

  // 音声認識の停止処理
  const stopRecognition = () => {
    if (speechRecognizer) {
      shouldContinueRecognition = false
      speechRecognizer.stop()
      speechRecognitionStatus.value = '停止'
    }
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
    speechRecognizer.start()
  }

  return {
    fullResultText,
    interimText,
    speechRecognitionStatus,
    startRecognition,
    stopRecognition,
  }
})
