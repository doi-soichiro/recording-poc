<template>
  <div class="relative">
    <!-- パスワード設定フォーム -->
    <Form @submit="submitFormHandler">
      <FormConfirmationCode
        v-model="confirmationCode"
        field-name="confirmationCode"
        placeholder="認証コードを入力"
        class="mb-4"
      />

      <div class="text-start text-sm my-3">
        認証コードの有効期限は３０分となります。<br>
      </div>

      <FormSignUpPassword
        v-model="newPassword"
        field-name="newPassword"
        placeholder="新しいパスワード"
        class="mb-4"
      />
      <FormSignUpPassword
        v-model="confirmPassword"
        field-name="confirmPassword"
        placeholder="新しいパスワードの再入力"
        class="mb-6"
      />
      <div class="flex space-x-4">
        <NuxtLink
          to="/auth/login"
          class="w-full"
        >
          <button
            type="button"
            class="w-full bg-gray-400 active:bg-gray-500 text-white py-4 rounded-md transition duration-300 ease-in-out"
          >
            キャンセル
          </button>
        </NuxtLink>
        <button
          type="submit"
          class="w-full bg-theme-main active:bg-theme-main-deeper text-white py-4 rounded-md transition duration-300 ease-in-out"
        >
          設定する
        </button>
      </div>
    </Form>
    <!-- API処理実行中のインジケータ -->
    <IndicatorCircleSpinner :loading-key="loadingKey" />
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'
import { AuthError } from 'aws-amplify/auth'
import { Form } from 'vee-validate'
import FormConfirmationCode from '~/components/atoms/Form/ConfirmationCode.vue'
import FormSignUpPassword from '~/components/atoms/Form/SignUpPassword.vue'
import IndicatorCircleSpinner from '~/components/atoms/Indicator/CircleSpinner.vue'

const { resetPassword } = useConfirmResetPassword()

interface Props {
  email: string
}

const props = defineProps<Props>()

const router = useRouter()
const toastStore = useToastStore()
const loadingStore = useLoadingStore()
const loadingKey = ref(uuidv4())

// ローカルステート管理
const confirmationCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// 新しいパスワードの送信処理
async function submitFormHandler() {
  loadingStore.startLoading(loadingKey.value)
  try {
    // バリデーション
    if (newPassword.value !== confirmPassword.value) {
      toastStore.addToast('error', '新しいパスワードと確認用パスワードが異なります。')
      return
    }
    await resetPassword(props.email, confirmationCode.value, newPassword.value)
    toastStore.addToast('success', 'パスワードの再設定が完了しました。')
    router.push('/auth/login')
  }
  catch (error) {
    let errorMsg
    if (error instanceof AuthError) {
      switch (error.name) {
        case 'CodeMismatchException':
          errorMsg = '認証コードが正しくありません。再入力してください。'
          break
        case 'ExpiredCodeException':
          errorMsg = '認証コードの有効期限が切れています。再度メールを送信してください。'
          break
        case 'InvalidPasswordException':
          errorMsg = '無効なパスワードです。セキュリティ要件を満たすパスワードを入力してください。'
          break
        case 'UserNotFoundException':
          errorMsg = '指定されたユーザーが存在しません。メールアドレスを確認してください。'
          break
        case 'NotAuthorizedException':
          errorMsg = 'リセット操作が許可されていません。管理者にお問い合わせください。'
          break
        default:
          errorMsg = '予期しないエラーが発生しました。管理者にお問い合わせください。'
          break
      }
    }
    else {
      errorMsg = '予期しないエラーが発生しました。管理者にお問い合わせください。'
    }
    toastStore.addToast('error', errorMsg)
  }
  finally {
    loadingStore.stopLoading(loadingKey.value)
  }
}
</script>
