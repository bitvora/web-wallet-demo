'use client';

import { useState } from 'react';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider, App } from 'antd';
import theme from '@/lib/theme';

const AppProviders = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: true
        }
      }
    })
  );

  return (
    <QueryClientProvider client={client}>
      <ReactQueryStreamedHydration>
        <ConfigProvider theme={theme} prefixCls="static">
          <App message={{ maxCount: 1 }} notification={{ maxCount: 1 }}>
            {children}
          </App>
        </ConfigProvider>
      </ReactQueryStreamedHydration>
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
};

export default AppProviders;
