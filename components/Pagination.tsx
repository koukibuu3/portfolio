import Link from 'next/link'
import React from 'react'
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi'

const Pagination: React.VFC = () => {
  return (
    <nav className="flex text-sm items-center text-center lg:mx-5">
      <Link href="/pages/1" passHref>
        <a className="inline-flex hover:text-orange-600">
          <HiOutlineChevronLeft className="mx-1" size="1.3em" />
          Previous
        </a>
      </Link>
      <ul className="grow p-2">
        <li className="inline-block px-4 hover:text-orange-600">
          <Link href="/pages/1">1</Link>
        </li>
        <li className="inline-block px-4 hover:text-orange-600">
          <Link href="/pages/2">2</Link>
        </li>
        <li className="inline-block px-4 hover:text-orange-600">
          <Link href="/pages/3">3</Link>
        </li>
        <li className="inline-block px-4 cursor-default">...</li>
        <li className="inline-block px-4 hover:text-orange-600">
          <Link href="/pages/8">8</Link>
        </li>
        <li className="inline-block px-4 hover:text-orange-600">
          <Link href="/pages/9">9</Link>
        </li>
        <li className="inline-block px-4 hover:text-orange-600">
          <Link href="/pages/10">10</Link>
        </li>
      </ul>
      <Link href="/pages/2" passHref>
        <a className="inline-flex hover:text-orange-600">
          Next
          <HiOutlineChevronRight className="mx-1" size="1.3em" />
        </a>
      </Link>
    </nav>
  )
}

export default Pagination
