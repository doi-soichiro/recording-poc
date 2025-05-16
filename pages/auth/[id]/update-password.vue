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
          パスワード再設定
        </div>
      </section>
      <AuthConfirmUpdatePasswordForm
        :store-staff-id="storeStaffId"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import AuthConfirmUpdatePasswordForm from '~/components/organisms/Auth/ConfirmUpdatePasswordForm.vue'

useHead({
  title: 'パスワード再設定',
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

// 本人以外は操作できないようにリダイレクト制御
onMounted(async () => {
  const signinUserId = await useSigninUser().getUserId()
  if (storeStaffId !== signinUserId) {
    toastStore.addToast('error', 'パスワードの編集はご本人のみ可能です。')
    router.push(`/settings`)
  }
})
</script>
