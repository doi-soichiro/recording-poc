// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],
  plugins: [
    '~/plugins/axios.ts',
    { src: '~/plugins/amplify.ts', ssr: false },
  ],
  imports: {
    dirs: [
      'utils/constants/**',
    ],
  },
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      baseApiUrl: process.env.BASE_API_URL,
      awsUserPoolsId: process.env.COGNITO_USER_POOL_ID,
      awsUserPoolsWebClientId: process.env.COGNITO_USER_POOL_CLIENT_ID,
      applicationCloudFrontUrl: process.env.APPLICATION_CLOUDFRONT_URL,
      webSocketUrl: process.env.WEB_SOCKET_URL,
      revisionId: process.env.REVISION_ID,
    },
  },
  compatibilityDate: '2024-11-01',
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        quotes: 'single',
        semi: false,
      },
    },
  },
})
