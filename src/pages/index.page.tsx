import type { NextPage } from 'next'

import { CustomHead, Pagination } from '~/components'
import { Copyright } from '~/components/Copyright/Copyright'
import { GlobalNavigation } from '~/components/GlobalNavigation'
import { KnowledgeList } from '~/components/Knowledge/KnowledgeList'
import { Section, SectionTitle } from '~/components/Section'
import { getStaticProps } from '~/pages/index.hook'
import { Knowledge, Page } from '~/types'

type Props = {
  knowledgeList: Knowledge[]
  page: Page
}

const IndexPage: NextPage<Props> = ({ knowledgeList, page }) => {
  return (
    <>
      <CustomHead />

      <div className="text-gray-600 mx-auto">
        <GlobalNavigation />

        <Section id="knowledge">
          <SectionTitle title="Knowledge" subTitle="技術メモ" />
          <KnowledgeList knowledgeList={knowledgeList} />
        </Section>

        <Pagination page={page} />
      </div>

      <Copyright />
    </>
  )
}

export default IndexPage

export { getStaticProps }
