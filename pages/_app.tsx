import '../styles/globals.css'

import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <SWRConfig
      value={{
        fetcher: url => fetch(url).then(r => r.json())
      }}>
      <ConfigProvider locale={zhCN}>
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </ConfigProvider>
    </SWRConfig>
  )
}

export default MyApp
