import type { NextPage } from 'next'

import { CustomHead, Pagination } from '~/components'
import { About } from '~/components/About'
import { ArticleList } from '~/components/Article/ArticleList'
import { Copyright } from '~/components/Copyright/Copyright'
import { GlobalNavigation } from '~/components/GlobalNavigation'
import { KnowledgeList } from '~/components/Knowledge/KnowledgeList'
import { Section, SectionTitle } from '~/components/Section'
import { useArticle } from '~/hooks/useArticle'
import { getStaticProps, Props } from '~/pages/index.hook'
import { Profile } from '~/types'

const IndexPage: NextPage<Props> = ({
  defaultArticles,
  knowledgeList,
  page,
}) => {
  const { articles, fetchMore, hasMore } = useArticle(defaultArticles)

  const profile: Profile = {
    name: 'Kouki Akasaka',
    id: 'koukibuu3',
    description: '都内在住Webエンジニア',
    imageUrl: '/img/logo.svg',
    links: [
      { name: 'GitHub', url: 'https://github.com/koukibuu3' },
      { name: 'Twitter', url: 'https://x.com/koukibuu3' },
      { name: 'Qiita', url: 'https://qiita.com/koukibuu3' },
      { name: 'Zenn', url: 'https://zenn.dev/koukibuu3' },
    ],
  }

  return (
    <>
      <CustomHead />

      <div className="text-gray-600 mx-auto">
        <GlobalNavigation />

        <Section id="article">
          <SectionTitle title="Article" subTitle="記事" />
          <ArticleList
            articles={articles}
            fetchMore={fetchMore}
            hasMore={hasMore}
          />
        </Section>

        <Section id="knowledge">
          <SectionTitle title="Knowledge" subTitle="技術メモ" />
          <KnowledgeList knowledgeList={knowledgeList} />
          <Pagination page={page} />
        </Section>

        <Section id="about">
          <SectionTitle title="About" subTitle="プロフィール" />
          <About profile={profile} />
        </Section>
      </div>

      <Copyright />
    </>
  )
}

export default IndexPage

export { getStaticProps }
