export interface MinutesDetail {
  minutesId: string // 議事録ID
  title: string // 議事録タイトル
  companyId: string // 会社ID
  storeId: string // 店舗ID
  staffId: string // 店舗スタッフID
  // customerId: string, // お客様ID
  startTreatmentAt: string // 施術開始日時
  endTreatmentAt: string // 施術終了日時
  createdBy: string // 作成者
  updatedBy: string // 更新者
}
export interface MinutesDetailWithZip extends MinutesDetail {
  recordedZipBlob: Blob // 録音・音声認識を格納したzip本体
  isUploaded: boolean // アップロード成功フラグ
}
