import { NextPage } from 'next'
import Image from 'next/image'

import { getStaticPaths, getStaticProps } from './[id].hook'

import { CustomHead } from '~/components'
import { Meta } from '~/components/Article/Meta'
import { Body } from '~/components/ArticleDetail/Body'
import { Copyright } from '~/components/Copyright/Copyright'
import { GlobalNavigation } from '~/components/GlobalNavigation'
import { Article } from '~/types'
type Props = {
  article: Article
}

const ArticlePage: NextPage<Props> = ({ article }) => {
  return (
    <>
      <CustomHead />

      <div className="text-gray-600 mx-auto mt-16">
        <GlobalNavigation />

        <Image
          src={article.mainImage.url}
          alt="記事のタイトル画像"
          width={article.mainImage.width}
          height={article.mainImage.height}
          className="w-full"
        />

        <div className="m-4 mb-16">
          <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
          <Meta tags={article.tags} publishedAt={article.publishedAt} />
        </div>

        <Body article={article} />
      </div>
      <Copyright />
    </>
  )
}

export default ArticlePage

export { getStaticPaths, getStaticProps }
