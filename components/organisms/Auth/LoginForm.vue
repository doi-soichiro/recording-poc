<template>
  <div class="relative">
    <!-- ログインフォーム -->
    <form
      class="flex flex-col"
      @submit.prevent="submitFormHandler"
    >
      <input
        v-model="email"
        field-name="email"
        placeholder="メールアドレス"
        type="email"
        class="mb-4 w-full px-4 py-4 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
      >
      <input
        v-model="password"
        field-name="password"
        placeholder="パスワード"
        type="password"
        class="mb-6 w-full px-4 py-4 border border-gray-300 rounded-md focus:ring focus:ring-gray-200 focus:outline-none"
      >
      <button
        type="submit"
        class="w-full bg-theme-main active:bg-theme-main-deeper text-white py-4 rounded-md transition duration-300 ease-in-out"
      >
        ログイン
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthError } from '@aws-amplify/auth'

const router = useRouter()
const { submitLoginForm } = useLogin()

const email = ref('')
const password = ref('')

const submitFormHandler = async () => {
  console.log('ログイン処理開始')
  try {
    const result = await submitLoginForm(email.value, password.value)
    console.log('ログイン成功', result)

    // 初回ログインの場合、パスワード設定画面に遷移
    if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
      router.push('/auth/create-new-password')
    }
    // ログイン成功の場合、ホーム画面に遷移
    else if (result.isSignedIn) {
      router.push('/')
    }
    else {
      // TODO:ログを出力する
    }
  }
  catch (error) {
    let errorMsg
    if (error instanceof AuthError) {
      switch (error.name) {
        case 'UserNotFoundException':
        case 'NotAuthorizedException':
          errorMsg = 'メールアドレスまたはパスワードが間違っています。再度ご確認ください。'
          break
        case 'NetworkError':
          errorMsg = 'ネットワークエラーが発生しました。インターネット接続を確認してください。'
          break
        default:
          errorMsg = 'ログインに失敗しました。再度ご確認ください。'
          console.log(error)
      }
    }
    else {
      errorMsg = 'ログイン中に予期しないエラーが発生しました。管理者にお問い合わせください。'
    }
    console.log(errorMsg)
  }
}
</script>
