import '/public/css/globals.css'
import type { AppProps } from 'next/app'

import { GoogleAnalytics } from '../components'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <GoogleAnalytics />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
