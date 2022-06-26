import Link from 'next/link'
import React from 'react'
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi'

import { Page } from '~/types'

const Pagination: React.FC<{ page: Page }> = ({ page }) => {
  return (
    <nav className="flex text-sm items-center text-center lg:mx-5">
      {page.previousPage ? (
        <Link href={`/pages/${page.previousPage}`} passHref>
          <a className="inline-flex hover:text-orange-600">
            <HiOutlineChevronLeft className="mx-1" size="1.3em" />
            Previous
          </a>
        </Link>
      ) : (
        <span className="inline-flex text-gray-300 cursor-default">
          <HiOutlineChevronLeft className="mx-1" size="1.3em" />
          Previous
        </span>
      )}
      <ul className="grow p-2">
        <span className="hidden md:inline-block">
          {page.items.map((item) =>
            item === page.currentPage ? (
              <li key={item} className="inline-flex cursor-default">
                <span className="inline-flex justify-center items-center w-6 h-6 mx-2 bg-gray-100 rounded-full">
                  {item}
                </span>
              </li>
            ) : (
              <li key={item} className="inline-flex">
                <Link href={`/pages/${item}`}>
                  <a className="inline-flex justify-center items-center w-6 h-6 mx-2 hover:text-orange-600">
                    {item}
                  </a>
                </Link>
              </li>
            )
          )}
        </span>
      </ul>
      {page.nextPage ? (
        <Link href={`/pages/${page.nextPage}`} passHref>
          <a className="inline-flex hover:text-orange-600">
            Next
            <HiOutlineChevronRight className="mx-1" size="1.3em" />
          </a>
        </Link>
      ) : (
        <span className="inline-flex text-gray-300 cursor-default">
          Next
          <HiOutlineChevronRight className="mx-1" size="1.3em" />
        </span>
      )}
    </nav>
  )
}

export default Pagination
