import { notFound, permanentRedirect } from 'next/navigation'
export default async function OldKnowledgePage({
  params,
}: {
  params: Promise<{ page: string }>
}) {
  const { page } = await params
  if (!/^[1-9]\d*$/.test(page)) notFound()
  permanentRedirect('/#writing')
}
