import '/public/css/globals.css'

import { type Metadata } from 'next'

import { GoogleAnalytics } from '~/components'
import { Copyright } from '~/components/Copyright/Copyright'
import { GlobalNavigation } from '~/components/GlobalNavigation'

export const metadata: Metadata = {
  title: "Engineer's Blog | koukibuu3",
  description: 'Portfolio',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: "Engineer's Blog | koukibuu3",
    description: 'Portfolio',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <GoogleAnalytics />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Engineer's Blog | koukibuu3"
          href="/api/rss"
        />
      </head>
      <body>
        <GlobalNavigation />
        <div className="text-gray-600 mt-16">{children}</div>
        <Copyright />
      </body>
    </html>
  )
}
