import { NextPage } from 'next'

import { CustomHead, Footer } from '~/components'
import { Pagination } from '~/components'
import { GlobalNavigation } from '~/components/GlobalNavigation'
import { KnowledgeList } from '~/components/Knowledge/KnowledgeList'
import { getStaticPaths, getStaticProps } from '~/pages/pages/[page].hook'
import { Knowledge, Page } from '~/types'

type Props = {
  knowledgeList: Knowledge[]
  page: Page
}

const PagePage: NextPage<Props> = ({ knowledgeList, page }) => {
  return (
    <>
      <CustomHead page={page.currentPage} />
      <div className="text-gray-600 mx-auto my-2">
        <GlobalNavigation />
        <KnowledgeList knowledgeList={knowledgeList} />
        <Pagination page={page} />
        <Footer />
      </div>
    </>
  )
}

export default PagePage

export { getStaticPaths, getStaticProps }
