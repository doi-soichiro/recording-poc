<template>
  <div class="relative">
    <!-- パスワード設定フォーム -->
    <form @submit="submitNewPassword">
      <input
        v-model="newPassword"
        field-name="newPassword"
        placeholder="新しいパスワード"
        class="mb-4"
      >
      <input
        v-model="confirmPassword"
        field-name="confirmPassword"
        placeholder="新しいパスワードの再入力"
        class="mb-6"
      >
      <button
        type="submit"
        class="w-full bg-theme-main active:bg-theme-main-deeper text-white py-4 rounded-md transition duration-300 ease-in-out"
      >
        パスワードを設定
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthError } from '@aws-amplify/auth'

const router = useRouter()
const { createNewPassword } = useCreateNewPassword()

// ローカルステート管理
const newPassword = ref('')
const confirmPassword = ref('')
// 新しいパスワードの送信処理
async function submitNewPassword() {
  // バリデーション
  if (newPassword.value !== confirmPassword.value) {
    console.error('新しいパスワードと確認用パスワードが異なります。')
    return
  }
  try {
    await createNewPassword(newPassword.value)
    router.push('/auth/complete-password-change')
  }
  catch (error) {
    if (error instanceof AuthError) {
      console.error('新しいパスワード設定失敗:', error.message)
    }
    else {
      console.error('新しいパスワード設定失敗:', error)
    }
  }
}
</script>
