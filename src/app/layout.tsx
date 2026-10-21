import './globals.css'
import type { Metadata } from 'next'
import { GoogleAnalytics } from '~/components/site/GoogleAnalytics'
import { SiteHeader } from '~/components/site/SiteHeader'
import { profile } from '~/content/profile'
import { jsonLd, site } from '~/content/site'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: '%s | koukibuu3.dev' },
  description: site.description,
  alternates: { canonical: '/', types: { 'application/rss+xml': '/api/rss' } },
  icons: { icon: '/favicon.ico' },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: 'koukibuu3.dev',
    title: site.title,
    description: site.description,
    url: site.url,
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', creator: '@koukibuu3' },
}
const themeInit = `(function(){try{var t=localStorage.getItem('portfolio-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}if(location.pathname==='/')history.scrollRestoration='manual'})()`
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <GoogleAnalytics />
      </head>
      <body>
        <SiteHeader />
        {children}
        <footer className="wrap footer">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <a href="/#home">Top ↑</a>
        </footer>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'koukibuu3.dev',
              url: site.url,
            }),
          }}
        />
      </body>
    </html>
  )
}
