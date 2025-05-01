import { type Metadata } from 'next'

import { metadata } from '~/app/layout'
import { Pagination } from '~/components'
import { KnowledgeList } from '~/components/Knowledge/KnowledgeList'
import { Section, SectionTitle } from '~/components/Section'
import { qiitaClient, zennClient } from '~/modules/libs'
import { KnowledgeRepository } from '~/modules/repositories/KnowledgeRepository'

type Props = {
  params: Promise<{ page: string }>
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { page } = await params

  return {
    title: `技術メモ [${page}ページ目] | ${metadata.title}`,
  }
}

const KnowledgePage = async ({ params }: Props) => {
  const { page } = await params
  const [knowledgeList, pageInfo] = await new KnowledgeRepository([
    qiitaClient,
    zennClient,
  ]).getWithPagination(Number(page), 6)

  return (
    <div className="mx-auto max-w-screen-xl my-2">
      <Section id="knowledge">
        <SectionTitle title="Knowledge" subTitle="技術メモ" />
        <KnowledgeList knowledgeList={knowledgeList} />
      </Section>
      <Pagination page={pageInfo} />
    </div>
  )
}

export default KnowledgePage
