import { signIn, type SignInInput } from '@aws-amplify/auth'

export const useLogin = () => {
  const submitLoginForm = async (email: string, password: string) => {
    const input: SignInInput = {
      username: email,
      password: password,
    }
    const { isSignedIn, nextStep } = await signIn(input)
    return {
      nextStep,
      isSignedIn,
    }
  }

  return {
    submitLoginForm,
  }
}
