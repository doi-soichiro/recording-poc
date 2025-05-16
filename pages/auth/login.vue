<template>
  <div class="flex min-h-screen justify-center">
    <div class="w-full max-w-lg mt-32 text-center bg-white rounded-lg">
      <div class="mb-8 text-lg font-bold w-full px-4">
        録音アプリにログインしよう！
      </div>
      <!-- ログインフォーム -->
      <AuthLoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import AuthLoginForm from '~/components/organisms/Auth/LoginForm.vue'

useHead({
  title: 'ログイン',
})
definePageMeta({
  // 認証用のレイアウトを設定
  layout: 'auth',
})
</script>
