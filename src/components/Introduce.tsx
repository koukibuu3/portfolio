import Image from 'next/image'
import React from 'react'

import { Accounts } from '~/components'
import { Portfolio } from '~/types'

type Props = {
  portfolio: Portfolio
  classNames?: string
}

const Introduce: React.FC<Props> = ({ portfolio, classNames }) => {
  return (
    <section className={classNames}>
      <Image
        alt="メイン画像"
        src={portfolio.mainImage.url}
        width={380}
        height={169}
        priority
      />
      <h1 className="text-5xl py-4 my-4 mr-4">{portfolio.title}</h1>
      <p className="text-base my-4 mr-4">{portfolio.detail}</p>
      <Accounts accounts={portfolio.accounts} />
    </section>
  )
}

export default Introduce
