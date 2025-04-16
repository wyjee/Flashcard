import type {Metadata} from 'next';
import {Suspense} from 'react';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Flash Card',
  description: 'Gain your knowledge with Ai powered Flash Card',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
      <Suspense fallback={<div>Loading...</div>}>
        <Providers>{children}</Providers>
      </Suspense>
      </body>
    </html>
  );
}