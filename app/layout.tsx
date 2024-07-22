import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Providers from './Providers';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Money Highway',
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
        <Providers>
          <div className="main-container">
            <main className="w-full h-full flex justify-center items-center">
              <div className="max-w-[600px] md:bg-purple rounded-lg h-full md:h-[unset] w-full md:w-2/3">
                <div className="justify-center text-center w-full px-4 py-6 mx-auto border-b-2 border-light border-opacity-20">
                  <div className="justify-center text-center w-full flex mx-auto mb-4 pb-4 md:mb-3 md:pb-2">
                    <Image src="/logo.png" height={40} width={110} alt="Bitvora" />
                  </div>

                  <h1 className="text-[35px] md:text-[30px] text-white font-medium tracking-tight mb-1">
                    Money Highway
                  </h1>
                  <p className="text-[14px] font-semibold text-light">
                    Demo the power of Bitvora’s API
                  </p>
                </div>

                <div className="px-4 md:px-8 py-8">{children}</div>
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
