import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/context/AuthProvider';
import ClientWrapper from './ClientWrapper';
import Navbar from '@/components/ui/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VisualizeX',
  description: 'An Algorithmic learning skew.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <Navbar/>
          <ClientWrapper>{children}</ClientWrapper>
        </body>
      </AuthProvider>
    </html>
  );
}