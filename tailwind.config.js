/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./node_modules/flowbite/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // メインテーマカラー
        'theme-main': '#85724e', // ヘッダー、決定ボタンの背景色で汎用的に利用。背景用のメインカラー
        'theme-main-readable': '#85724e', // テキスト色で汎用的に利用。テキスト用のメインカラー
        'theme-main-readable-variant': '#7c6a48', // 一部テキスト用のメインカラー差分
        'theme-main-deeper': '#6a5b3e', // ボタン押下時の背景で汎用的に利用。メインカラーの濃い色
        'theme-main-light': '#b6aa95', // 設定画面の枠線、テキスト・アイコン押下時の色で汎用的に利用。メインカラーの薄い色

        // 特定箇所で利用する色
        'theme-header-menu-accent': '#fbbf24', // ヘッダーメニューを目立たせる色
        'theme-home-waiting-display': '#111111', // ホーム画面の待機表示の背景色
        'theme-home-care-timer-disabled': '#aeaeae', // ホーム画面の施術時間カウントの文字色
        'theme-home-play-button': '#3089F0', // ホーム画面の再生ボタン
        'theme-home-stop-button-disabled': '#afa89c', // ホーム画面の再生終了ボタン押下後の停止アイコン
        'theme-home-tab': '#bd5298', // ホーム画面のアクション選択タブ
        'theme-staff-list-table-header': '#f2f2f2', // スタッフ一覧画面のテーブルヘッダー
        'theme-staff-list-trash-icon-disabled': '#d9d9d9', // スタッフ一覧の削除アイコンの非活性色
        'theme-table-border': '#ebebeb', // 設定画面のテーブル内側の枠線
        'theme-update-password-button': '#f3f1ed', // スタッフ編集画面のパスワード再設定ボタン押下中の色

        // 通知レベルに応じた色
        'theme-warning': '#f26660', // 削除・停止・ペアリング解除ボタンの色
        'theme-warning-deeper': '#c2524d', // 削除・停止・ペアリング解除ボタン押下中の色
      }
    },
  },
}