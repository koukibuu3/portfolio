import React, { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'

const Header: React.VFC = () => {
  const [isOpenNavigation, setIsOpenNavigation] = useState(false)

  return (
    <nav
      className={`flex fixed top-0 inset-x-0 z-10 p-2 lg:p-5 lg:mx-28 xl:mx-44 2xl:mx-80 ${
        isOpenNavigation ? 'bg-gray-600' : 'bg-white'
      }`}
    >
      <div className="grow lg:grow-0 lg:items-center lg:w-auto lg:ml-auto">
        <div
          className={`lg:flex mt-12 lg:m-0 ${
            isOpenNavigation ? 'block text-gray-100' : 'hidden text-gray-600'
          }`}
        >
          <a
            href="#skills"
            className="block text-center my-4 lg:mx-6 lg:my-0 lg:hover:text-gray-300"
            onClick={() => isOpenNavigation && setIsOpenNavigation(false)}
          >
            <span className="block text-xl">Skills</span>
            <span className="block text-xs">技術</span>
          </a>
          <a
            href="#articles"
            className="block text-center my-4 lg:mx-6 lg:my-0 lg:hover:text-gray-300"
            onClick={() => isOpenNavigation && setIsOpenNavigation(false)}
          >
            <span className="block text-xl">Articles</span>
            <span className="block text-xs">開発メモ</span>
          </a>
          <a
            href="#contacts"
            className="block text-center my-4 lg:mx-6 lg:my-0 lg:hover:text-gray-300"
            onClick={() => isOpenNavigation && setIsOpenNavigation(false)}
          >
            <span className="block text-xl">Contacts</span>
            <span className="block text-xs">お問い合わせ</span>
          </a>
        </div>
      </div>
      <div className="lg:hidden h-14">
        <button
          className={`text-gray-600 absolute right-2 top-2 p-2 m-3 ${
            isOpenNavigation ? 'hidden' : 'block'
          }`}
          onClick={() => setIsOpenNavigation(true)}
        >
          <FaBars size="1.2em" />
        </button>
        <button
          className={`text-gray-100 absolute right-2 top-2 p-2 m-3 ${
            isOpenNavigation ? 'block' : 'hidden'
          }`}
          onClick={() => setIsOpenNavigation(false)}
        >
          <FaTimes size="1.2em" />
        </button>
      </div>
    </nav>
  )
}

export default Header
