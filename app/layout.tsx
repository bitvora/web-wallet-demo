import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Image from 'next/image';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bitvora',
  description: 'bitvora'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <main className="w-full h-full flex justify-center items-center">
            <div className="max-w-[600px] bg-purple w-2/3 rounded-lg">
              <div className="justify-center text-center w-full px-4 py-6 mx-auto border-b-2 border-light border-opacity-20">
                <div className="justify-center text-center w-full flex mx-auto mb-3">
                  <Image src="/logo.png" height={40} width={110} alt="Bitvora" />
                </div>

                <h1 className="text-[30px] text-white font-medium tracking-tight">Money Highway</h1>
                <p className="text-[13px] font-semibold text-light">
                  Demo the power of Bitvora’s API
                </p>
              </div>

              <div className="px-8 py-8 mt-4">{children}</div>
            </div>
          </main>
        </AntdRegistry>
      </body>
    </html>
  );
}
