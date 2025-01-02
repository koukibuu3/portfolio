import Head from 'next/head'
import React from 'react'

type Props = {
  title: string
  imageUrl?: string
}

const CustomHead: React.FC<Props> = ({
  title,
  imageUrl = 'https://koukibuu3.net/img/logo.png',
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@koukibuu3" />
    </Head>
  )
}

export default CustomHead
