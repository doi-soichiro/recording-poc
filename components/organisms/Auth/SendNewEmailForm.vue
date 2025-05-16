<template>
  <div>
    <Form @submit="submitFormHandler">
      <FormEmail
        v-model="email"
        field-name="email"
        placeholder="新しいメールアドレス"
        class="mb-7"
      />
      <div class="flex space-x-4">
        <ButtonCancelBack />
        <button
          type="submit"
          class="w-full bg-theme-main active:bg-theme-main-deeper text-white py-4 rounded-md transition duration-300 ease-in-out"
        >
          認証コードを送信
        </button>
      </div>
    </Form>
    <!-- API処理実行中のインジケータ -->
    <IndicatorCircleSpinner :loading-key="loadingKey" />
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { Form } from 'vee-validate'
import FormEmail from '~/components/atoms/Form/Email.vue'
import ButtonCancelBack from '~/components/atoms/Button/CancelBack.vue'
import IndicatorCircleSpinner from '~/components/atoms/Indicator/CircleSpinner.vue'

const { postStoreStaffEmailChange } = useStoreStaffService()
const toastStore = useToastStore()
const loadingStore = useLoadingStore()
const loadingKey = ref(uuidv4())

interface Props { storeStaffId: string }
const props = defineProps<Props>()
const { storeStaffId } = props

type Emits = {
  (e: 'sentEmail', email: string,): void
}
const emit = defineEmits<Emits>()

const email = ref('')

// 認証コードを送信ボタンの押下時
async function submitFormHandler() {
  try {
    loadingStore.startLoading(loadingKey.value)
    // 新しいメールアドレスに認証コードを送信
    const responseMessage = await postStoreStaffEmailChange(
      {
        newEmail: email.value,
      },
      storeStaffId,
    )
    toastStore.addToast('success', responseMessage)
    emit('sentEmail', email.value)
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
