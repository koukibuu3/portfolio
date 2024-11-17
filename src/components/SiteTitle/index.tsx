import Image from 'next/image'
import Link from 'next/link'

/**
 * サイトタイトル
 */
export const SiteTitle: React.FC = () => {
  return (
    <div className="flex items-center ml-1">
      <Image
        src="/img/logo.svg"
        alt=""
        loading="eager"
        height={50}
        width={50}
      />
      <Link href="/" className="ml-2.5 text-xl font-bold hover:text-blue-500">
        Engineer&lsquo;s Blog
        <span className="border-r border-gray-500 mx-2.5" />
        <span className="text-sm">koukibuu3</span>
      </Link>
    </div>
  )
}
