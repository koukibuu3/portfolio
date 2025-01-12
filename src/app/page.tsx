import { Pagination } from '~/components'
import { About } from '~/components/About'
import { ArticleList } from '~/components/Article/ArticleList'
import { KnowledgeList } from '~/components/Knowledge/KnowledgeList'
import { Section, SectionTitle } from '~/components/Section'
import { client, microCmsClient } from '~/libs'
import { ArticleRepository } from '~/modules/repositories/ArticleRepository'
import { ProfileRepository } from '~/modules/repositories/ProfileRepository'

const IndexPage = async () => {
  const [articles, [knowledgeList, page], profile] = await Promise.all([
    new ArticleRepository(microCmsClient).getWithPagination(0, 6),
    client.getAllWithPagination(0, 6),
    new ProfileRepository(microCmsClient).get(),
  ])

  return (
    <div className="mx-auto max-w-screen-xl">
      <Section id="article">
        <SectionTitle title="Article" subTitle="記事" />
        <ArticleList defaultArticles={articles} />
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
  )
}

export default IndexPage
