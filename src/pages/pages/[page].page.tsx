import { NextPage } from 'next'

import { CustomHead, Footer } from '~/components'
import { Pagination } from '~/components'
import { GlobalNavigation } from '~/components/GlobalNavigation'
import { NoteList } from '~/components/Note/NoteList'
import { getStaticPaths, getStaticProps } from '~/pages/pages/[page].hook'
import { Note, Page } from '~/types'

type Props = {
  notes: Note[]
  page: Page
}

const PagePage: NextPage<Props> = ({ notes, page }) => {
  return (
    <>
      <CustomHead page={page.currentPage} />
      <div className="text-gray-600 mx-auto my-2">
        <GlobalNavigation />
        <NoteList notes={notes} />
        <Pagination page={page} />
        <Footer />
      </div>
    </>
  )
}

export default PagePage

export { getStaticPaths, getStaticProps }
