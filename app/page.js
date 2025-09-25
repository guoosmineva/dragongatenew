'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/lib/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const [games, setGames] = useState([])
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      // Try external API first, fallback to mock data if it fails
      let gamesData, articlesData

      try {
        const gamesRes = await fetch(`/api/strapi/games?featured=true`)
        if (gamesRes.ok) {
          const data = await gamesRes.json()
          gamesData = data
        } else {
          throw new Error('API failed')
        }
      } catch (error) {
        console.warn('API failed, using fallback data')
        // Fallback mock data
        gamesData = {
          data: [
            {
              id: 1, documentId: 'wukong-1', title: 'Wukong', 
              description: 'Epic action RPG based on the legendary Monkey King.',
              category: 'Action', slug: 'wukong', featured: true, downloads: 125000,
              bannerImage: { url: 'https://images.unsplash.com/photo-1673350808686-209dc177c898?w=400&h=225&fit=crop' }
            },
            {
              id: 2, documentId: 'call-me-champion-2', title: 'Call Me Champion',
              description: 'Intense competitive fighting game.',
              category: 'Action', slug: 'call-me-champion', featured: true, downloads: 89000,
              bannerImage: { url: 'https://images.unsplash.com/photo-1543622748-5ee7237e8565?w=400&h=225&fit=crop' }
            },
            {
              id: 3, documentId: 'civilization-3', title: 'Civilization',
              description: 'Build and expand your empire through the ages.',
              category: 'Strategy', slug: 'civilization', featured: true, downloads: 234000,
              bannerImage: { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop' }
            }
          ]
        }
      }

      try {
        const articlesRes = await fetch(`/api/strapi/articles`)
        if (articlesRes.ok) {
          const data = await articlesRes.json()
          articlesData = data
        } else {
          throw new Error('Articles API failed')
        }
      } catch (error) {
        articlesData = { data: [] } // Empty articles for now
      }

      setGames(gamesData.data || [])
      setArticles(articlesData.data || [])
    } catch (error) {
      console.error('Error fetching home data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">{t('loading')}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="https://ik.imagekit.io/meoh789/logo-dgp.png" 
              alt="Game Catalog Logo" 
              width={40} 
              height={40} 
              className="rounded"
            />
            <span className="text-white text-xl font-bold">GameVault</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-blue-300 transition-colors">{t('home')}</Link>
            <Link href="/catalog" className="text-white hover:text-blue-300 transition-colors">{t('catalog')}</Link>
            <Link href="/trending" className="text-white hover:text-blue-300 transition-colors">{t('trending')}</Link>
            <Link href="/blog" className="text-white hover:text-blue-300 transition-colors">{t('blog')}</Link>
          </nav>

          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            <a 
              href="https://web.telegram.org/k/#@behemoth168?text=Halo%2C%20I%20am%20interested%20in%20this%20game%2C%20can%20i%20have%20more%20information%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
            >
              Telegram
            </a>
            <a 
              href="https://wa.me/62816339871?text=Halo%2C%20I%20am%20interested%20in%20this%20game%2C%20can%20i%20have%20more%20information%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {t('discoverGames').split(' ').slice(0, -1).join(' ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{t('discoverGames').split(' ').pop()}</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('ultimateDestination')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-yellow-400 px-8 py-3 text-lg font-semibold">
                {t('browseCatalog')}
              </Button>
            </Link>
            <Link href="/trending">
              <Button variant="outline" size="lg" className="border-white/20 text-yellow-400 hover:bg-white/10 px-8 py-3 text-lg font-semibold">
                {t('trending')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">{t('featuredGames')}</h2>
            <p className="text-gray-300">{t('handpickedGames')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card key={game.documentId} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
                <CardHeader>
                  <div className="aspect-video bg-gray-800 rounded-lg mb-4 overflow-hidden">
                    {game.bannerImage?.url ? (
                      <Image
                        src={game.bannerImage.url}
                        alt={game.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-white text-xl">{game.title}</CardTitle>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {t(game.category)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 mb-4 line-clamp-3">
                    {game.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{game.downloads?.toLocaleString()} {t('downloads')}</span>
                    <Link href={`/game/${game.slug}`}>
                      <Button variant="outline" className="border-blue-500/30 text-yellow-400 hover:bg-blue-500/20 font-semibold">
                        {t('viewGame')}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/catalog">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                {t('viewAllGames')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      {articles.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">{t('latestArticles')}</h2>
              <p className="text-gray-300">{t('stayUpdated')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Card key={article.documentId} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
                  <CardHeader>
                    {article.featuredImage?.url && (
                      <div className="aspect-video bg-gray-800 rounded-lg mb-4 overflow-hidden">
                        <Image
                          src={article.featuredImage.url}
                          alt={article.title}
                          width={400}
                          height={225}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardTitle className="text-white text-lg">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 mb-4 line-clamp-3">
                      {article.excerpt}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{new Date(article.publishedDate).toLocaleDateString()}</span>
                      <Link href={`/article/${article.slug}`}>
                        <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20">
                          {t('readMore')}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/blog">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  {t('viewAllArticles')}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image 
                  src="https://ik.imagekit.io/meoh789/logo-dgp.png" 
                  alt="GameVault Logo" 
                  width={32} 
                  height={32} 
                  className="rounded"
                />
                <span className="text-white text-xl font-bold">GameVault</span>
              </div>
              <p className="text-gray-400 mb-4">
                {t('ultimateDestination')}
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">{t('navigation')}</h3>
              <div className="space-y-2">
                <Link href="/" className="block text-gray-400 hover:text-white transition-colors">{t('home')}</Link>
                <Link href="/catalog" className="block text-gray-400 hover:text-white transition-colors">{t('catalog')}</Link>
                <Link href="/trending" className="block text-gray-400 hover:text-white transition-colors">{t('trending')}</Link>
                <Link href="/blog" className="block text-gray-400 hover:text-white transition-colors">{t('blog')}</Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">{t('contact')}</h3>
              <div className="space-y-2">
                <a 
                  href="https://web.telegram.org/k/#@behemoth168?text=Halo%2C%20I%20am%20interested%20in%20this%20game%2C%20can%20i%20have%20more%20information%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Telegram
                </a>
                <a 
                  href="https://wa.me/62816339871?text=Halo%2C%20I%20am%20interested%20in%20this%20game%2C%20can%20i%20have%20more%20information%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-400 hover:text-green-400 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">{t('legal')}</h3>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-gray-400 hover:text-white transition-colors">{t('privacyPolicy')}</Link>
                <Link href="/terms" className="block text-gray-400 hover:text-white transition-colors">{t('termsOfService')}</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 GameVault. {t('allRightsReserved')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}