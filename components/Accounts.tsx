import React from 'react'

import {
  FacebookIcon,
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  ZennIcon,
} from '../components/icons'
import { Account } from '../types'

type Props = {
  accounts: Account[]
}

const Accounts: React.VFC<Props> = ({ accounts }) => (
  <div className="flex my-2">
    {accounts.map((account) => (
      <a
        href={account.url}
        target="_blank"
        rel="noopener noreferrer"
        key={account.type[0]}
      >
        {account.type[0] === 'facebook' ? (
          <FacebookIcon />
        ) : account.type[0] === 'github' ? (
          <GithubIcon />
        ) : account.type[0] === 'linkedin' ? (
          <LinkedinIcon />
        ) : account.type[0] === 'twitter' ? (
          <TwitterIcon />
        ) : account.type[0] === 'zenn' ? (
          <ZennIcon />
        ) : (
          ''
        )}
      </a>
    ))}
  </div>
)

export default Accounts
