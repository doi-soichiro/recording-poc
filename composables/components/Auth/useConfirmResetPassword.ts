import { confirmResetPassword } from '@aws-amplify/auth'

export const useConfirmResetPassword = () => {
  const resetPassword = async (email: string, confirmationCode: string, newPassword: string) => {
    await confirmResetPassword({
      username: email,
      confirmationCode: confirmationCode,
      newPassword: newPassword,
    })
    console.log('新しいパスワードの設定が完了しました')
  }

  return {
    resetPassword,
  }
}
