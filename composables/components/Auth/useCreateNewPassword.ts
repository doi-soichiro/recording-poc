import { confirmSignIn } from '@aws-amplify/auth'

export const useCreateNewPassword = () => {
  const createNewPassword = async (newPassword: string) => {
    await confirmSignIn({
      challengeResponse: newPassword,
      options: {
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
      },
    })
    console.log('新しいパスワードの登録が成功しました')
  }

  return {
    createNewPassword,
  }
}
