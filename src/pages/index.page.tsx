import type { NextPage } from 'next'

import { CustomHead, Footer, Pagination } from '~/components'
import { GlobalNavigation } from '~/components/GlobalNavigation'
import { KnowledgeList } from '~/components/Knowledge/KnowledgeList'
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
        <KnowledgeList knowledgeList={knowledgeList} />
        <Pagination page={page} />
      </div>

      <Footer />
    </>
  )
}

export default IndexPage

export { getStaticProps }
