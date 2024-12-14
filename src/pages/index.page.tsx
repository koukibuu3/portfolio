import type { NextPage } from 'next'

import { CustomHead, Pagination } from '~/components'
import { ArticleList } from '~/components/Article/ArticleList'
import { Copyright } from '~/components/Copyright/Copyright'
import { GlobalNavigation } from '~/components/GlobalNavigation'
import { KnowledgeList } from '~/components/Knowledge/KnowledgeList'
import { Section, SectionTitle } from '~/components/Section'
import { getStaticProps } from '~/pages/index.hook'
import { Knowledge, Page } from '~/types'

type Props = {
  knowledgeList: Knowledge[]
  page: Page
  environment: string
}

const IndexPage: NextPage<Props> = ({ knowledgeList, page, environment }) => {
  const articles =
    environment !== 'production'
      ? [
          {
            id: '1',
            title: 'とってもかわいいまめちゃんの記事です',
            description:
              'まめちゃんはとってもかわいいです。何が可愛いかというととにかくかわいいんです。かわいいったら可愛いんです。だから、かわいいって言ってんでしょうが。かわいいというのですはね、',
            tags: [
              { id: '1', name: '猫' },
              { id: '2', name: '天使' },
            ],
            mainImageUrl: '/img/sample-thumbnail.jpg',
            publishedAt: '2024-12-14',
          },
          {
            id: '2',
            title: 'とってもかわいいまめちゃんの記事です',
            description:
              'まめちゃんはとってもかわいいです。何が可愛いかというととにかくかわいいんです。かわいいったら可愛いんです。だから、かわいいというのですはね、なんだっけかな、えーっと',
            tags: [],
            mainImageUrl: '/img/sample-thumbnail.jpg',
            publishedAt: '2024-12-14',
          },
          {
            id: '3',
            title: 'とってもかわいいまめちゃんの記事です',
            description:
              'まめちゃんはとってもかわいいです。何が可愛いかというととにかくかわいいんです。かわいいったら可愛いんです。だから、かわいいというのですはね、つまるところ、かわいいんです。',
            tags: [
              { id: '1', name: '猫' },
              { id: '2', name: '天使' },
            ],
            mainImageUrl: '/img/sample-thumbnail.jpg',
            publishedAt: '2024-12-14',
          },
        ]
      : []

  return (
    <>
      <CustomHead />

      <div className="text-gray-600 mx-auto">
        <GlobalNavigation />

        <Section id="article">
          <SectionTitle title="Article" subTitle="記事" />
          <ArticleList articles={articles} />
        </Section>

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
