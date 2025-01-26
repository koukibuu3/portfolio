import React from 'react'

import { SlideItem } from './SlideItem'

import { Slide } from '~/types'

type Props = {
  slides: Slide[]
}

export const SlideList: React.FC<Props> = ({ slides }) => {
  return (
    <ul className="flex gap-2 m-4 overflow-x-auto">
      {slides.map((slide) => (
        <SlideItem key={slide.url} slide={slide} />
      ))}
    </ul>
  )
}
