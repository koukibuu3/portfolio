import type { NextPage } from 'next'

import { CustomHead, Footer, Pagination } from '~/components'
import { GlobalNavigation } from '~/components/GlobalNavigation'
import { NoteList } from '~/components/Note/NoteList'
import { getStaticProps } from '~/pages/index.hook'
import { Note, Page } from '~/types'

type Props = {
  notes: Note[]
  page: Page
}

const IndexPage: NextPage<Props> = ({ notes, page }) => {
  return (
    <>
      <CustomHead />

      <div className="text-gray-600 mx-auto">
        <GlobalNavigation />
        <NoteList notes={notes} />
        <Pagination page={page} />
      </div>

      <Footer />
    </>
  )
}

export default IndexPage

export { getStaticProps }
