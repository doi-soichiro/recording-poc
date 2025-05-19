import { defineStore } from 'pinia'
import { ref } from 'vue'

// 録音処理を管理するストア
export const useRecorderStore = defineStore('recorder', () => {
  const isRecording = ref(false)
  const chunks = ref<Blob[]>([])
  const blob = ref<Blob | null>(null)
  const recorder = ref<MediaRecorder | null>(null)
  const stream = ref<MediaStream | null>(null)

  // MediaStreamの初期化
  const initStream = async () => {
    if (!stream.value) {
      stream.value = await navigator.mediaDevices.getUserMedia({ audio: true })
    }
    return stream.value
  }

  // 録音開始処理
  const startRecording = async () => {
    await initStream()

    chunks.value = []
    recorder.value = new MediaRecorder(stream.value as MediaStream, { mimeType: RECORDED_DATA_MIME_TYPE })

    recorder.value.ondataavailable = (e: BlobEvent) => {
      if (e.data.size > 0) {
        chunks.value.push(e.data)
      }
    }

    // 録音停止時の処理
    recorder.value.onstop = () => {
      isRecording.value = false
      blob.value = new Blob(chunks.value, { type: RECORDED_DATA_MIME_TYPE })
      console.log('録音停止 & blob生成')
    }

    recorder.value.start()
    isRecording.value = true
    console.log('録音開始')
  }

  const stopRecording = async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (recorder.value && recorder.value.state !== 'inactive') {
        recorder.value.onstop = () => {
          isRecording.value = false
          blob.value = new Blob(chunks.value, { type: RECORDED_DATA_MIME_TYPE })
          console.log('録音停止 & blob生成')
          resolve(blob.value)
        }

        recorder.value.stop()
      }
      else {
        resolve(null)
      }
    })
  }

  // 録音データの取得処理
  const getRecordedBlob = (): Blob | null => {
    if (!chunks.value.length) return null
    return new Blob(chunks.value, { type: RECORDED_DATA_MIME_TYPE })
  }

  return {
    isRecording,
    startRecording,
    stopRecording,
    getRecordedBlob,
    blob,
    stream,
  }
})
