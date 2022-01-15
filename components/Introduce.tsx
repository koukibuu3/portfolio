import Image from 'next/image'
import React from 'react'

import { Portfolio } from '../types'

import { Accounts } from '.'

type Props = {
  portfolio: Portfolio
  classNames?: string
}

const Introduce: React.VFC<Props> = ({ portfolio, classNames }) => {
  return (
    <section className={classNames}>
      <Image
        alt="メイン画像"
        src={portfolio.mainImage.url}
        width={380}
        height={169}
        priority
      />
      <h1 className="text-5xl py-4 px-2">{portfolio.title}</h1>
      <p className="text-base px-2">{portfolio.detail}</p>
      <Accounts accounts={portfolio.accounts} />
    </section>
  )
}

export default Introduce
