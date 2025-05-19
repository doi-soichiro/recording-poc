<template>
  <div class="flex flex-wrap items-center gap-4">
    <button
      class="px-4 py-2 bg-green-600 text-white rounded"
      @click="play"
    >
      ▶ 再生
    </button>
    <button
      class="px-4 py-2 bg-yellow-500 text-white rounded"
      @click="pause"
    >
      ⏸ 一時停止
    </button>
    <button
      class="px-4 py-2 bg-red-600 text-white rounded"
      @click="stop"
    >
      ⏹ 停止
    </button>
    <!-- シークバー -->
    <input
      v-model="currentTime"
      type="range"
      min="0"
      :max="duration"
      step="0.1"
      class="min-w-[100px] max-w-[180px] flex-1 h-2 bg-gray-300 rounded"
      @input="seek"
    >
    <!-- 音量設定 -->
    <div class="flex items-center gap-2">
      <label
        for="volume"
        class="text-sm text-gray-600"
      >
        音量
      </label>
      <input
        id="volume"
        v-model.number="volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        class="w-[60px] h-2 bg-gray-300 rounded"
      >
      <span class="w-1 text-sm text-gray-600">{{ Math.round(volume * 100) }}%</span>
    </div>

    <div class="text-sm text-gray-600 w-full text-right">
      {{ Math.floor(Math.min(currentTime, duration)) }} / {{ Math.floor(duration) }} 秒
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps<{
  recordedBlob: string
}>()

const currentTime = ref(0)
const duration = ref(0)
let audio: HTMLAudioElement | null = null

watch(() => props.recordedBlob, (url) => {
  if (!url) return

  // 古いインスタンスがある場合は停止・破棄
  if (audio) {
    audio.pause()
    audio.src = ''
    audio.load()
  }

  // 新しいインスタンス作成
  audio = new Audio()

  // 音声のメタデータが読み込まれた時の処理
  audio.addEventListener('loadedmetadata', () => {
    if (!audio) return
    // このタイミングでは duration が 0 の場合があるので、durationchange イベントを待つ
    if (Number.isFinite(audio.duration)) {
      duration.value = audio.duration
      console.log('✅ loadedmetadata fired')
      console.log('✅ duration:', audio.duration)
    }
  })

  // 再生中に時間が更新された時の処理
  audio.addEventListener('timeupdate', () => {
    if (!audio) return
    currentTime.value = audio.currentTime
  })

  // 音声の長さが変更(確定)した時の処理
  audio.addEventListener('durationchange', () => {
    if (!audio) return
    if (Number.isFinite(audio.duration)) {
      duration.value = audio.duration
    }
  })

  audio.addEventListener('ended', () => {
    currentTime.value = 0
  })

  // ✅ 最後に src を設定して load
  audio.src = url
  audio.load()
}, { immediate: true })

const play = () => audio?.play()
const pause = () => audio?.pause()
const stop = () => {
  if (!audio) return
  audio.pause()
  audio.currentTime = 0
}

const seek = () => {
  if (!audio) return
  audio.currentTime = currentTime.value
}
const volume = ref(1)

watch(volume, (val) => {
  if (audio) {
    audio.volume = val
  }
})

onUnmounted(() => {
  if (!audio) return
  audio.pause()
  audio.src = ''
  audio.removeAttribute('src')
  audio = null
})
</script>
