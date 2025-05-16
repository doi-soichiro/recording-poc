export interface PostMinutesRequest {
  minutesId: string // 議事録ID
  title: string // 議事録タイトル
  companyId: string // 会社ID
  storeId: string // 店舗ID
  staffId: string // 店舗スタッフID
  startTreatmentAt: string // 施術開始日時
  endTreatmentAt: string // 施術終了日時
  // customerId: string // お客様ID
  createdBy: string // 作成者
  updatedBy: string // 更新者
}
