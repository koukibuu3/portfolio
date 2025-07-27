import { ArticleRepository } from '~/modules/repositories/ArticleRepository'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get('page') || 0
  const perPage = searchParams.get('perPage') || 6

  const articles = await new ArticleRepository().getWithPagination(Number(page), Number(perPage))

  return new Response(JSON.stringify(articles), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
