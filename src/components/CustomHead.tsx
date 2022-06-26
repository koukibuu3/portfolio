import Head from 'next/head'
import React from 'react'

type Props = {
  page?: number
  imageUrl?: string
}

const CustomHead: React.FC<Props> = ({ page, imageUrl = '/img/logo.svg' }) => {
  const title = `Engineer's Blog | koukibuu3${page ? ` [page${page}]` : ''}`

  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:image" content={imageUrl} />
    </Head>
  )
}

export default CustomHead
