import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GameVault - Discover Amazing Games',
  description: 'Your ultimate destination for discovering the best mobile and PC games. Explore our curated collection of games across all genres.',
  keywords: 'games, mobile games, PC games, game catalog, game downloads, gaming',
  authors: [{ name: 'GameVault Team' }],
  openGraph: {
    title: 'GameVault - Discover Amazing Games',
    description: 'Your ultimate destination for discovering the best mobile and PC games.',
    type: 'website',
    locale: 'en_US',
    siteName: 'GameVault',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GameVault - Discover Amazing Games',
    description: 'Your ultimate destination for discovering the best mobile and PC games.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}