import '../styles/globals.css'
import '../styles/globals.less';

import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
    value={{
      fetcher: url => fetch(url).then(r => r.json())
    }}>
      <Component {...pageProps} />
    </SWRConfig>
  )
}

export default MyApp
