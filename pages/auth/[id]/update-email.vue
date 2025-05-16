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
      <section>
        <div class="text-base font-medium mb-8">
          メールアドレス再設定
        </div>
      </section>
      <!-- 新メールアドレス入力 -->
      <template v-if="!isSendEmail">
        <AuthUpdateNewEmailForm
          :store-staff-id="storeStaffId"
          @sent-email="sentEmail"
        />
      </template>
      <!-- 認証コード入力 -->
      <template v-if="isSendEmail">
        <AuthConfirmUpdateEmailForm
          :store-staff-id="storeStaffId"
          :email="email"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthUpdateNewEmailForm from '~/components/organisms/Auth/SendNewEmailForm.vue'
import AuthConfirmUpdateEmailForm from '~/components/organisms/Auth/ConfirmUpdateEmailForm.vue'

useHead({
  title: 'メールアドレス再設定',
})
definePageMeta({
  // 認証用のレイアウトを設定
  layout: 'auth',
})

const toastStore = useToastStore()
const route = useRoute()
const router = useRouter()

// ルートパラメータからstoreStaffIdを取得
const storeStaffId = route.params.id.toString()

// ローカルステート管理
const email = ref('')
const isSendEmail = ref(false)

const sentEmail = (emailAddress: string) => {
  email.value = emailAddress
  isSendEmail.value = true
}

// 本人以外は操作できないようにリダイレクト制御
onMounted(async () => {
  const signinUserId = await useSigninUser().getUserId()
  if (storeStaffId !== signinUserId) {
    toastStore.addToast('error', 'メールアドレスの編集はご本人のみ可能です。')
    router.push(`/settings`)
  }
})
</script>
