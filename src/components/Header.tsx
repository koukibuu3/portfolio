import Image from 'next/image'
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
          Engineer&lsquo;s Blog
          <span className="hidden sm:inline">
            <span className="border-r border-gray-600 mx-4" />
            koukibuu3
          </span>
        </h1>
      </span>
      <button className="lg:hidden mx-2 my-6">
        <FaBars />
      </button>
      <nav className="hidden lg:flex items-center m-2">
        <ul>
          <li>
            <button>Articles</button>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
