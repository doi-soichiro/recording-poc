export interface PostMinutesRequest {
  minutesId: string // 議事録ID
  careStartAt: string // 施術開始日時
  careEndAt: string // 施術終了日時
  companyId: string // 会社ID
  storeId: string // 店舗ID
  storeStaffId: string // 店舗スタッフID
  customerId: string // お客様ID
  recordedZipBlob: Blob // 録音・音声認識を格納したzip本体
  isUploaded: boolean // アップロード成功フラグ
}
