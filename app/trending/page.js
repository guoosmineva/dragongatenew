'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function TrendingPage() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingGames()
  }, [])

  const fetchTrendingGames = async () => {
    try {
      // Mock trending games with high download counts
      const trendingGames = [
        {
          id: 5, documentId: 'clash-of-clans-5', title: 'Clash of Clans',
          description: 'The classic strategy game where you build your village, train troops, and battle other players. Join clans and participate in epic clan wars.',
          category: 'Strategy', slug: 'clash-of-clans', featured: true, downloads: 456000,
          downloadUrl: 'https://qqby-goc-hk.oss-cn-hongkong.aliyuncs.com/blct/blctTT_1.0.10.zip',
          bannerImage: { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop' },
          trendingRank: 1
        },
        {
          id: 4, documentId: 'civilization-4', title: 'Civilization',
          description: 'Build and expand your empire through the ages. Develop technologies, wage wars, and lead your civilization to greatness in this epic strategy game.',
          category: 'Strategy', slug: 'civilization', featured: true, downloads: 234000,
          downloadUrl: 'https://goc-cdn.qqby.cn/wm/Civilization_tk_1.5.9.zip',
          bannerImage: { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop' },
          trendingRank: 2
        },
        {
          id: 12, documentId: 'minions-12', title: 'Minions',
          description: 'Join the lovable Minions on their hilarious adventure! Experience fun-filled gameplay with your favorite yellow characters in this family game.',
          category: 'Adventure', slug: 'minions', featured: false, downloads: 187000,
          downloadUrl: 'https://goc-cdn.qqby.cn/xiaobing/WarpipsGame_1.2.3.zip',
          bannerImage: { url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=225&fit=crop' },
          trendingRank: 3
        },
        {
          id: 3, documentId: 'dragonball-showdown-3', title: 'Dragonball Showdown',
          description: 'High-energy fighting game featuring your favorite Dragon Ball characters. Unleash devastating attacks and experience the ultimate anime fighting experience.',
          category: 'Action', slug: 'dragonball-showdown', featured: true, downloads: 156000,
          downloadUrl: 'https://qqby-goc-hangzhou.oss-cn-hangzhou.aliyuncs.com/lzTK/DragonBall_tk_v1.0.3.zip',
          bannerImage: { url: 'https://images.unsplash.com/photo-1673350808686-209dc177c898?w=400&h=225&fit=crop' },
          trendingRank: 4
        },
        {
          id: 13, documentId: 'sheep-village-13', title: 'The Sheep Village',
          description: 'Build and manage your own peaceful sheep village. Take care of your flock, expand your farm, and create the perfect pastoral paradise.',
          category: 'Simulation', slug: 'sheep-village', featured: false, downloads: 134000,
          downloadUrl: 'https://goc-cdn.qqby.cn/xiaobing/WarpipsGame_1.2.3.zip',
          bannerImage: { url: 'https://images.unsplash.com/photo-1543622748-5ee7237e8565?w=400&h=225&fit=crop' },
          trendingRank: 5
        },
        {
          id: 1, documentId: 'wukong-1', title: 'Wukong',
          description: 'Epic action RPG based on the legendary Monkey King. Experience breathtaking combat and explore a mystical world filled with ancient legends and powerful enemies.',
          category: 'Action', slug: 'wukong', featured: true, downloads: 125000,
          downloadUrl: 'https://goc-cdn.qqby.cn/tg/HihTT_2.6.5.zip',
          bannerImage: { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop' },
          trendingRank: 6
        }
      ]

      setGames(trendingGames)
    } catch (error) {
      console.error('Error fetching trending games:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (game) => {
    window.open(game.downloadUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading trending games...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image 
              src="https://ik.imagekit.io/meoh789/logo-dgp.png" 
              alt="Game Catalog Logo" 
              width={64} 
              height={64} 
              className="rounded"
            />
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-blue-300 transition-colors">Home</Link>
            <Link href="/catalog" className="text-white hover:text-blue-300 transition-colors">Catalog</Link>
            <Link href="/trending" className="text-blue-300 font-semibold">Trending Games</Link>
            <Link href="/blog" className="text-white hover:text-blue-300 transition-colors">Blog</Link>
          </nav>

          <div className="flex items-center space-x-3">
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

      {/* Page Header */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-yellow-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Trending Games</h1>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover the hottest games everyone's playing! These games are trending on TikTok Live and have the highest downloads.
          </p>
        </div>
      </section>

      {/* Trending Games Grid */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card key={game.documentId} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all group relative">
                {/* Trending Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-yellow-500 text-black font-bold">
                    #{game.trendingRank} Trending
                  </Badge>
                </div>

                <CardHeader className="p-0">
                  <div className="aspect-video bg-gray-800 rounded-t-lg overflow-hidden">
                    {game.bannerImage?.url ? (
                      <Image
                        src={game.bannerImage.url}
                        alt={game.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-800 to-gray-900">
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-white text-lg leading-tight">{game.title}</CardTitle>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 ml-2 shrink-0">
                      {game.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-300 mb-4 line-clamp-3 text-sm">
                    {game.description}
                  </CardDescription>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-sm">
                      <Download className="w-4 h-4 inline mr-1" />
                      {game.downloads.toLocaleString()} downloads
                    </span>
                    <span className="text-yellow-400 text-sm font-semibold">🔥 Trending</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/game/${game.slug}`} className="flex-1">
                      <Button variant="outline" size="sm" className="border-blue-500/30 text-yellow-400 hover:bg-blue-500/20 w-full font-semibold">
                        {t('viewDetails')}
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => handleDownload(game)}
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-yellow-400 flex items-center gap-2 font-semibold"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image 
                  src="https://ik.imagekit.io/meoh789/logo-dgp.png" 
                  alt="GameVault Logo" 
                  width={40} 
                  height={40} 
                  className="rounded"
                />
              </div>
              <p className="text-gray-400 mb-4">
                Your ultimate destination for discovering amazing games across all platforms.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Navigation</h3>
              <div className="space-y-2">
                <Link href="/" className="block text-gray-400 hover:text-white transition-colors">Home</Link>
                <Link href="/catalog" className="block text-gray-400 hover:text-white transition-colors">Catalog</Link>
                <Link href="/trending" className="block text-gray-400 hover:text-white transition-colors">Trending</Link>
                <Link href="/blog" className="block text-gray-400 hover:text-white transition-colors">Blog</Link>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
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
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 GameVault. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}