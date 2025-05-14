import type { AxiosResponse } from 'axios'
import type { GetminutesSignUrlResponse } from '~/interfaces/api/minutes/response/GetminutesSignUrlResponse'
import type { GetminutesSignUrlRequest } from '~/interfaces/api/minutes/request/GetminutesSignUrlRequest'
import type { PutRecordingZipRequest } from '~/interfaces/api/minutes/request/PutRecordingZipRequest'

export const useMinutesService = () => {
  const { $axios } = useNuxtApp()

  // 録音・音声認識データを格納したzipのアップロード処理
  const uploadRecordingZip = async (request: GetminutesSignUrlRequest, file: File): Promise<void> => {
    const { id, extension } = request
    try {
      const headers = await prepareHeaders({ useAuth: true })
      const response: AxiosResponse<GetminutesSignUrlResponse> = await $axios.get(`/minutes/${id}/sign-url`, { params: { extension }, headers })
      const uploadUrl = response.data.uploadUrl
      await uploadFile({ uploadUrl, file })
    }
    catch (error) {
      console.log('ファイルアップロード用署名付きURL取得処理でエラーが発生しました：', error)
      // const errorMsg = useCreateApiErrorMessage(error, 'ファイルアップロード用署名付きURL取得処理')
      // throw errorMsg
    }
  }

  // ファイルアップロード処理
  const uploadFile = async (request: PutRecordingZipRequest): Promise<void> => {
    try {
      const contentType = request.file.type
      const headers = { 'Content-Type': contentType }
      await $axios.put(request.uploadUrl, request.file, { headers })
    }
    catch (error) {
      console.log('ファイルアップロード処理でエラーが発生しました：', error)
      // const errorMsg = useCreateApiErrorMessage(error, 'ファイルアップロード用署名付きURL取得処理')
      // throw errorMsg
    }
  }

  return {
    uploadRecordingZip,
  }
}
