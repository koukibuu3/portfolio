import { Pagination } from '~/components'
import { About } from '~/components/About'
import { ArticleList } from '~/components/Article/ArticleList'
import { KnowledgeList } from '~/components/Knowledge/KnowledgeList'
import { Section, SectionTitle } from '~/components/Section'
import { SlideList } from '~/components/Slide/SlideList'
import { microCmsClient, qiitaClient, zennClient } from '~/modules/libs'
import { ArticleRepository } from '~/modules/repositories/ArticleRepository'
import { KnowledgeRepository } from '~/modules/repositories/KnowledgeRepository'
import { ProfileRepository } from '~/modules/repositories/ProfileRepository'
import { SlideRepository } from '~/modules/repositories/SlideRepository'

const IndexPage = async () => {
  const [articles, [knowledgeList, page], profile, slides] = await Promise.all([
    new ArticleRepository(microCmsClient).getWithPagination(1, 6),
    new KnowledgeRepository([qiitaClient, zennClient]).getWithPagination(1, 6),
    new ProfileRepository(microCmsClient).get(),
    new SlideRepository().getAll(),
  ])

  return (
    <div className="mx-auto max-w-screen-lg">
      <Section id="article">
        <SectionTitle title="Article" subTitle="記事" />
        <ArticleList defaultArticles={articles} />
      </Section>

      <Section id="knowledge">
        <SectionTitle title="Knowledge" subTitle="技術メモ" />
        <KnowledgeList knowledgeList={knowledgeList} />
        <Pagination page={page} />
      </Section>

      <Section id="slide">
        <SectionTitle title="Slides" subTitle="発表資料" />
        <SlideList slides={slides} />
      </Section>

      <Section id="about">
        <SectionTitle title="About" subTitle="プロフィール" />
        <About profile={profile} />
      </Section>
    </div>
  )
}

export default IndexPage
