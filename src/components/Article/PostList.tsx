'use client'

import { useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'

import { PostItem } from './PostItem'

import type { Post } from '~/types'

const PER_PAGE = 6

type Props = {
  posts: Post[]
}

export const PostList: React.FC<Props> = ({ posts }) => {
  const [visibleCount, setVisibleCount] = useState(PER_PAGE)
  const hasMore = visibleCount < posts.length

  if (posts.length === 0) {
    return <p className="text-sm mt-6 mx-auto w-32">記事がありません</p>
  }

  return (
    <ul className="grid grid-cols-2 gap-10 m-4">
      {posts.slice(0, visibleCount).map((post) => {
        const key =
          post.source === 'microcms' ? post.data.id : post.data.id
        return <PostItem key={`${post.source}-${key}`} post={post} />
      })}
      {hasMore && (
        <li className="col-span-2">
          <button
            className="text-md border rounded-sm p-2 w-full mx-auto flex items-center justify-center gap-2"
            onClick={() => setVisibleCount((prev) => prev + PER_PAGE)}
          >
            Next <IoIosArrowDown />
          </button>
        </li>
      )}
    </ul>
  )
}
