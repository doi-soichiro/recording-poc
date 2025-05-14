import { Amplify } from 'aws-amplify'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const clientId = config.public.awsUserPoolsWebClientId
  const userPoolId = config.public.awsUserPoolsId

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolClientId: clientId,
        userPoolId: userPoolId,
      },
    },
  })
})
