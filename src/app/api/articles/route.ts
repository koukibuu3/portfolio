import { articleWithBody, articles } from '~/content/articles'
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const page = params.get('page') ?? '1'
  const perPage = params.get('perPage') ?? '6'
  if (
    !/^[1-9]\d*$/.test(page) ||
    !/^[1-9]\d*$/.test(perPage) ||
    !Number.isSafeInteger(Number(page)) ||
    Number(perPage) > 100
  )
    return Response.json(
      { error: 'page must be a positive integer; perPage must be 1–100' },
      { status: 400 },
    )
  const offset = (Number(page) - 1) * Number(perPage)
  return Response.json(
    await Promise.all(
      articles.slice(offset, offset + Number(perPage)).map(articleWithBody),
    ),
    { headers: { 'Cache-Control': 'public, max-age=300' } },
  )
}
