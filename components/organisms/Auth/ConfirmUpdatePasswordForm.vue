<template>
  <div>
    <!-- パスワード設定フォーム -->
    <Form @submit="submitFormHandler">
      <FormSignUpPassword
        v-model="oldPassword"
        field-name="oldPassword"
        placeholder="古いパスワード"
        class="mb-4"
      />
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
        <ButtonCancelBack />
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
import { Form } from 'vee-validate'
import { v4 as uuidv4 } from 'uuid'
import { AuthError, updatePassword } from 'aws-amplify/auth'
import FormSignUpPassword from '~/components/atoms/Form/SignUpPassword.vue'
import IndicatorCircleSpinner from '~/components/atoms/Indicator/CircleSpinner.vue'
import ButtonCancelBack from '~/components/atoms/Button/CancelBack.vue'

const loadingKey = ref(uuidv4())

const router = useRouter()
const toastStore = useToastStore()
const loadingStore = useLoadingStore()

interface Props { storeStaffId: string }
const props = defineProps<Props>()
const { storeStaffId } = props

// ローカルステート管理
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// 新しいパスワードの送信処理
async function submitFormHandler() {
  try {
    loadingStore.startLoading(loadingKey.value)
    // バリデーション
    if (oldPassword.value === newPassword.value) {
      toastStore.addToast('error', '古いパスワードと新しいパスワードが同じです。')
      return
    }
    if (newPassword.value !== confirmPassword.value) {
      toastStore.addToast('error', '新しいパスワードと確認用パスワードが異なります。')
      return
    }

    // サインインユーザのパスワード更新
    await updatePassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    })
    toastStore.addToast('success', 'パスワードの更新が完了しました。')

    // 更新したユーザーのスタッフ編集画面に遷移
    router.push(`/settings/store-staff/${storeStaffId}`)
  }
  catch (error) {
    let errorMsg
    if (error instanceof AuthError) {
      switch (error.name) {
        case 'NotAuthorizedException':
          errorMsg = 'パスワードが間違っています。再度入力してください。'
          break
        case 'LimitExceededException':
          errorMsg = 'リクエスト回数が制限を超えています。しばらくしてから再試行してください。'
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
