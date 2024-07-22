'use client';

import { ConfigProvider, App } from 'antd';
import theme from '@/lib/theme';
import { AntdRegistry } from '@ant-design/nextjs-registry';

const Providers = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <AntdRegistry>
      <ConfigProvider theme={theme} prefixCls="static">
        <App message={{ maxCount: 5 }} notification={{ maxCount: 1 }}>
          {children}
        </App>
      </ConfigProvider>
    </AntdRegistry>
  );
};

export default Providers;
