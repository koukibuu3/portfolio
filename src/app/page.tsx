import dayjs from 'dayjs'

import { About } from '~/components/About'
import { PostList } from '~/components/Article/PostList'
import { Section, SectionTitle } from '~/components/Section'
import { SlideList } from '~/components/Slide/SlideList'
import { microCmsClient, qiitaClient, zennClient } from '~/modules/libs'
import { ArticleRepository } from '~/modules/repositories/ArticleRepository'
import { KnowledgeRepository } from '~/modules/repositories/KnowledgeRepository'
import { ProfileRepository } from '~/modules/repositories/ProfileRepository'
import { SlideRepository } from '~/modules/repositories/SlideRepository'
import type { Post } from '~/types'

const IndexPage = async () => {
  const [articles, knowledgeList, profile, slides] = await Promise.all([
    new ArticleRepository(microCmsClient).getWithPagination(1, 20),
    new KnowledgeRepository([qiitaClient, zennClient]).getAll(),
    new ProfileRepository(microCmsClient).get(),
    new SlideRepository().getAll(),
  ])

  const posts: Post[] = [
    ...articles.map(
      (article): Post => ({ source: 'microcms', data: article }),
    ),
    ...knowledgeList.map(
      (knowledge): Post => ({ source: knowledge.type, data: knowledge }),
    ),
  ].sort((a, b) => {
    const dateA =
      a.source === 'microcms' ? a.data.publishedAt : a.data.created_at
    const dateB =
      b.source === 'microcms' ? b.data.publishedAt : b.data.created_at
    return dayjs(dateA).isAfter(dateB) ? -1 : 1
  })

  return (
    <div className="mx-auto max-w-screen-lg">
      <Section id="article">
        <SectionTitle title="Article" subTitle="記事" />
        <PostList posts={posts} />
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
