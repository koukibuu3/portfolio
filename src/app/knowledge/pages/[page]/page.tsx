import { type Metadata } from 'next'
import { metadata } from '~/app/layout'
import { Pagination } from '~/components'
import { KnowledgeList } from '~/components/Knowledge/KnowledgeList'
import { Section, SectionTitle } from '~/components/Section'
import { client } from '~/libs'

type Props = {
  params: Promise<{ page: string }>
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { page } = await params
  const [_knowledgeList, pageInfo] = await client.getAllWithPagination(
    (Number(page) - 1) * 6,
    6,
  )

  return {
    title: `技術メモ [${pageInfo.currentPage}ページ目] | ${metadata.title}`,
  }
}

const KnowledgePage = async ({ params }: Props) => {
  const { page } = await params
  const [knowledgeList, pageInfo] = await client.getAllWithPagination(
    (Number(page) - 1) * 6,
    6,
  )

  return (
    <div className="text-gray-600 mx-auto max-w-screen-xl my-2">
      <Section id="knowledge">
        <SectionTitle title="Knowledge" subTitle="技術メモ" />
        <KnowledgeList knowledgeList={knowledgeList} />
      </Section>
      <Pagination page={pageInfo} />
    </div>
  )
}

export default KnowledgePage
