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
      <div v-if="!isSendEmail">
        <AuthSendEmail
          @sent-email="sentEmail"
        />
      </div>
      <div v-if="isSendEmail">
        <AuthConfirmResetPasswordForm
          :email="email"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthSendEmail from '~/components/organisms/Auth/SendEmailForm.vue'
import AuthConfirmResetPasswordForm from '~/components/organisms/Auth/ConfirmResetPasswordForm.vue'

// ローカルステート管理
const email = ref('')
const isSendEmail = ref(false)

useHead({
  title: 'パスワード再設定',
})
definePageMeta({
  // 認証用のレイアウトを設定
  layout: 'auth',
})

const sentEmail = (emailAddress: string) => {
  email.value = emailAddress
  isSendEmail.value = true
}
</script>
