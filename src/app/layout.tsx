import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AI Video Generator',
  description: 'Create stunning videos with AI-powered generation using advanced video models',
  keywords: 'AI video generation, video creator, artificial intelligence, video production',
  authors: [{ name: 'AI Video Generator' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-gray-50 dark:bg-gray-900 min-h-screen`}>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  © 2024 AI Video Generator. Create professional videos with AI.
                </div>
                <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400">
                  <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer">
                    Privacy Policy
                  </span>
                  <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer">
                    Terms of Service
                  </span>
                  <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer">
                    Support
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}