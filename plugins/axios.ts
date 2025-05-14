import type { AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios'

// Axiosのインスタンスの型を定義
declare module '#app' {
  interface NuxtApp {
    $axios: AxiosInstance
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const baseApiUrl = config.public.baseApiUrl
  const api: AxiosInstance = axios.create({
    baseURL: baseApiUrl,
  })

  api.interceptors.request.use(
    (config) => {
      console.log('リクエストインターセプター')
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  api.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log('レスポンスインターセプター')
      console.log(`ステータスコード:${response.status}`)
      return response
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  nuxtApp.provide('axios', api)
})
