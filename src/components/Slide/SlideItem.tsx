import Image from 'next/image'

import { Slide } from '~/types'

type Props = {
  slide: Slide
}

export const SlideItem: React.FC<Props> = ({ slide }) => {
  return (
    <li className="flex-shrink-0 min-w-[320px] mr-2 mb-6 w-80 md:w-96">
      <a
        href={slide.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block border-2 shadow-[3px_4px_5px_rgba(0,0,0,0.25)]"
      >
        <Image
          src={slide.mainImagePath}
          alt={slide.title}
          width={500}
          height={250}
        />
        <p className="py-1 px-2 font-bold">{slide.title}</p>
      </a>
    </li>
  )
}
