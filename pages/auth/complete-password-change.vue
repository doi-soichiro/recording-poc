<template>
  <div class="flex min-h-screen justify-center">
    <div class="w-full max-w-lg mt-32 text-center bg-white rounded-lg">
      <!-- ロゴ画像 -->
      <div class="pt-4 pb-8 px-4 flex justify-center">
        <img
          src="/heal-logo-text-black.svg"
          class="h-7 w-auto"
        >
      </div>
      <p class="text-sm mb-6">
        パスワードの設定が完了しました。
      </p>
      <AuthCompletePasswordChange />
    </div>
  </div>
</template>

<script setup lang="ts">
import AuthCompletePasswordChange from '~/components/organisms/Auth/CompletePasswordChange.vue'

useHead({
  title: '初回パスワード設定',
})
definePageMeta({
  // 認証用のレイアウトを設定
  layout: 'auth',
})
</script>
