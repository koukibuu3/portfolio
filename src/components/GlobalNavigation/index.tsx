import Link from 'next/link'
import React, { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'

import { SiteTitle } from '../SiteTitle'

/**
 * グローバルナビゲーション
 */
export const GlobalNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="flex justify-between fixed top-0 w-full bg-white h-16 z-50 p-2.5">
      <SiteTitle />
      <div className="flex items-center">
        <div className="w-12 h-12 p-3 ml-auto">
          <FaBars className="w-6 h-6 m-auto" onClick={() => setIsOpen(true)} />
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed top-0 right-0 h-full w-full bg-black opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}
      <nav
        className={`fixed top-0 right-0 w-40 h-full p-2.5 bg-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="w-12 h-12 p-2 ml-auto">
          <FaTimes
            className="w-7 h-7 m-auto"
            onClick={() => setIsOpen(false)}
          />
        </div>
        <ul
          className="flex flex-col items-start text-lg font-bold"
          onClick={() => setIsOpen(false)}
        >
          <li className="w-full my-1.5">
            <Link
              href="/#articles"
              className="block w-full p-1 hover:text-blue-500"
            >
              Articles
            </Link>
          </li>
          <li className="w-full my-1.5">
            <Link
              href="/#slides"
              className="block w-full p-1 hover:text-blue-500"
            >
              Slides
            </Link>
          </li>
          <li className="w-full my-1.5">
            <Link
              href="/#knowledge"
              className="block w-full p-1 hover:text-blue-500"
            >
              Knowledge
            </Link>
          </li>
          <li className="w-full my-1.5">
            <Link
              href="/#about"
              className="block w-full p-1 hover:text-blue-500"
            >
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
