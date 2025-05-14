import { fetchAuthSession } from 'aws-amplify/auth'

export async function prepareHeaders({ useAuth = true }: { useAuth?: boolean } = { useAuth: true }): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }

  if (useAuth) {
    // トークンを取得
    try {
      const session = await fetchAuthSession()
      const tokens = session.tokens

      if (!tokens) {
        throw new Error('トークンが取得できませんでした')
      }

      const idToken = tokens.idToken
      if (!idToken) {
        throw new Error('IDトークンが取得できませんでした')
      }
      const idTokenStr = idToken.toString()
      const accessToken = tokens.accessToken.toString()

      headers['Authorization'] = `Bearer ${idTokenStr}`
      headers['X-Access-Token'] = accessToken
    }
    catch (error) {
      console.error('トークンの取得に失敗しました:', error)
      return Promise.reject(error) // トークンがない場合はリクエストを中止
    }
  }

  return headers
}
