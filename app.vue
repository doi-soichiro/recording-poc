<template>
  <nuxt-page />
</template>

<script setup lang="ts">
onMounted(async() => {
  const indexedDBStore = useIndexedDBStore()
  // データベース初期化
  indexedDBStore.init()
  
  // ブラウザストレージの使用量を取得
  navigator.storage.estimate().then(({ quota, usage }) => {
    console.log(`使用量: ${usage}, 総容量: ${quota}`)
  })
})
  
</script>