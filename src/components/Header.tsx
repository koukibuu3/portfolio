import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaBars } from 'react-icons/fa'

const Header: React.FC = () => {
  return (
    <header className="flex justify-between text-xl text-gray-600">
      <span className="flex items-center">
        <Image
          src="/img/logo.svg"
          alt=""
          loading="eager"
          height={70}
          width={70}
        />
        <h1 className="mx-4 lg:mx-6">
          <Link href={'/'} className="hover:text-orange-600">
            Engineer&lsquo;s Blog
            <span className="hidden sm:inline">
              <span className="border-r border-gray-600 mx-4" />
              koukibuu3
            </span>
          </Link>
        </h1>
      </span>
    </header>
  )
}

export default Header
