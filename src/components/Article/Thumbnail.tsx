import Image from 'next/image'

type Props = {
  url: string
  alt: string
}

export const Thumbnail: React.FC<Props> = ({ url, alt }) => {
  return (
    <div className="relative w-full h-52">
      <Image src={url} alt={alt} className="object-cover rounded-md" fill />
    </div>
  )
}
