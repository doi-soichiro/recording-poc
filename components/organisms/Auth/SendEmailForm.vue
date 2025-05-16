<template>
  <div class="relative">
    <section>
      <div class="text-base font-medium mb-3">
        パスワード再設定
      </div>
      <div class="text-sm mb-8">
        メールアドレスを入力してください。
      </div>
    </section>
    <Form
      class="w-full"
      @submit="submitFormHandler"
    >
      <FormEmail
        v-model="email"
        field-name="email"
        placeholder="メールアドレス"
        class="mb-4"
      />
      <section class="mt-5 mb-7">
        <div class="text-start text-sm">
          ご登録されているメールアドレスに認証コードを送信します。<br>
          メールアドレスをお忘れの場合は、お手数ですがヘルプデスクにお問い合わせください。
        </div>
      </section>
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
          メールを送信
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
import { Form } from 'vee-validate'
import { AuthError } from '@aws-amplify/auth'
import FormEmail from '~/components/atoms/Form/Email.vue'
import IndicatorCircleSpinner from '~/components/atoms/Indicator/CircleSpinner.vue'

const { sendEmail } = useSendEmail()
const toastStore = useToastStore()
const loadingStore = useLoadingStore()
const loadingKey = ref(uuidv4())

type Emits = {
  (e: 'sentEmail', email: string,): void
}
const emit = defineEmits<Emits>()

// ローカルステート管理
const email = ref('')

// 新しいパスワードの送信処理
async function submitFormHandler() {
  loadingStore.startLoading(loadingKey.value)
  try {
    await sendEmail(email.value)
    toastStore.addToast('success', '入力されたメールアドレスに認証コードを送信しました。')
    emit('sentEmail', email.value)
  }
  catch (error) {
    let errorMsg
    if (error instanceof AuthError) {
      switch (error.name) {
        case 'UserNotFoundException':
          errorMsg = '指定されたメールアドレスが登録されていません。'
          break
        case 'LimitExceededException':
          errorMsg = 'リクエスト回数が制限を超えています。しばらくしてから再試行してください。'
          break
        case 'InvalidParameterException':
          errorMsg = '入力されたメールアドレスが正しくありません。'
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
