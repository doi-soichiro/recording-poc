<template>
  <div>
    <Form @submit="submitFormHandler">
      <FormConfirmationCode
        v-model="confirmationCode"
        field-name="confirmationCode"
        placeholder="認証コードを入力"
        class="mb-4"
      />
      <div class="text-start text-sm mb-8">
        認証コードの有効期限は３０分となります。<br>
      </div>
      <div class="flex space-x-4">
        <ButtonCancelBack />
        <button
          type="submit"
          class="w-full bg-theme-main active:bg-theme-main-deeper text-white py-4 rounded-md transition duration-300 ease-in-out"
        >
          認証する
        </button>
      </div>

      <button
        type="button"
        class="my-8 text-theme-main-readable-variant text-sm"
        @click="resendEmail"
      >
        認証コードを再送信<br>
      </button>
    </Form>
    <!-- API処理実行中のインジケータ -->
    <IndicatorCircleSpinner :loading-key="loadingKey" />
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { Form } from 'vee-validate'
import ButtonCancelBack from '~/components/atoms/Button/CancelBack.vue'
import IndicatorCircleSpinner from '~/components/atoms/Indicator/CircleSpinner.vue'
import FormConfirmationCode from '~/components/atoms/Form/ConfirmationCode.vue'

const { postStoreStaffEmailChange, postStoreStaffEmailVerify } = useStoreStaffService()
const router = useRouter()
const toastStore = useToastStore()
const loadingStore = useLoadingStore()
const loadingKey = ref(uuidv4())

interface Props { storeStaffId: string, email: string }
const props = defineProps<Props>()
const { storeStaffId, email } = props

const confirmationCode = ref('')

// 認証するボタンの押下時
async function submitFormHandler() {
  try {
    loadingStore.startLoading(loadingKey.value)
    // 新しいメールアドレスに認証コードを送信
    const responseMessage = await postStoreStaffEmailVerify(
      {
        newEmail: email,
        confirmationCode: confirmationCode.value,
      },
      storeStaffId,
    )
    toastStore.addToast('success', responseMessage)
    router.push(`/settings/store-staff/${storeStaffId}`)
  }
  catch (error) {
    console.error(error)
    toastStore.addToast('error', String(error))
  }
  finally {
    loadingStore.stopLoading(loadingKey.value)
  }
}

// 認証コードを再送信ボタンの押下時
async function resendEmail() {
  try {
    loadingStore.startLoading(loadingKey.value)
    // 再度、新しいメールアドレスに認証コードを送信
    const responseMessage = await postStoreStaffEmailChange(
      {
        newEmail: email,
      },
      storeStaffId,
    )
    toastStore.addToast('success', responseMessage)
  }
  catch (error) {
    console.error(error)
    toastStore.addToast('error', String(error))
  }
  finally {
    loadingStore.stopLoading(loadingKey.value)
  }
}
</script>
