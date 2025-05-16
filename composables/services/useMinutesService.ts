import type { AxiosResponse } from 'axios'
import type { PostMinutesResponse } from '~/interfaces/api/minutes/response/PostMinutesResponse'
import type { PostMinutesRequest } from '~/interfaces/api/minutes/request/PostMinutesRequest'
import type { GetminutesSignUrlResponse } from '~/interfaces/api/minutes/response/GetminutesSignUrlResponse'

export const useMinutesService = () => {
  const { $axios } = useNuxtApp()

  // 議事録情報登録処理
  const postMinutes = async (params: PostMinutesRequest): Promise<string> => {
    try {
      const headers = await prepareHeaders({ useAuth: true })
      const response: AxiosResponse<PostMinutesResponse> = await $axios.post(`/minutes`, params, { headers })
      const minutesId = response.data.minutesId
      return `議事録情報を送信しました（minutesId=${minutesId}）`
    }
    catch (error) {
      console.log('議事録情報登録処理でエラーが発生しました：', error)
      // const errorMsg = useCreateApiErrorMessage(error, '議事録情報登録処理')
      const errorMsg = '議事録情報登録処理でエラーが発生しました'
      throw errorMsg
    }
  }

  // ファイルアップロード用署名付きURL取得処理
  const getMinutesSignUrl = async (minutesId: string): Promise<string> => {
    try {
      const headers = await prepareHeaders({ useAuth: true })
      const response: AxiosResponse<GetminutesSignUrlResponse> = await $axios.get(`/minutes/upload-url/${minutesId}`, { headers })
      const uploadUrl = response.data.uploadUrl
      return uploadUrl
    }
    catch (error) {
      console.log('ファイルアップロード用署名付きURL取得処理でエラーが発生しました：', error)
      // const errorMsg = useCreateApiErrorMessage(error, 'ファイルアップロード用署名付きURL取得処理')
      const errorMsg = 'ファイルアップロード用署名付きURL取得処理でエラーが発生しました'
      throw errorMsg
    }
  }

  // 録音・音声認識データを格納したzipファイルのアップロード処理
  const uploadFile = async (uploadUrl: string, file: File): Promise<void> => {
    try {
      const contentType = file.type
      const headers = { 'Content-Type': contentType }
      await $axios.put(uploadUrl, file, { headers })
    }
    catch (error) {
      console.log('ファイルアップロード処理でエラーが発生しました：', error)
      // const errorMsg = useCreateApiErrorMessage(error, 'ファイルアップロード用署名付きURL取得処理')
      const errorMsg = 'ファイルアップロード処理でエラーが発生しました'
      throw errorMsg
    }
  }

  return {
    postMinutes,
    getMinutesSignUrl,
    uploadFile,
  }
}
