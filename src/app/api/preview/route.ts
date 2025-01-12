import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const draftKey = searchParams.get('draftKey')
  const slug = searchParams.get('slug')

  if (!slug) {
    return new Response('Invalid token', { status: 401 })
  }
  const content = await fetch(
    `https://koukibuu3.microcms.io/api/v1/articles/${slug}?fields=id&draftKey=${draftKey}`,
    { headers: { 'X-MICROCMS-API-KEY': process.env.MICROCMS_API_KEY || '' } },
  )
    .catch((error) => {
      console.error(error)
      return null
    })
    .then((res) => res?.json())

  if (!content) {
    return new Response('Invalid slug', { status: 401 })
  }

  // Cookieを設定し、ドラフトモードを有効にする
  const draft = await draftMode()
  draft.enable()

  // 取得した情報からパスを指定してリダイレクトする
  redirect(`/articles/${slug}?draftKey=${draftKey}`)
}
