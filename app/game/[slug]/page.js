'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Calendar, Users, Star, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function GameDetailPage() {
  const params = useParams()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.slug) {
      fetchGameDetails(params.slug)
    }
  }, [params.slug])

  const fetchGameDetails = async (slug) => {
    try {
      // Mock game details data
      const gameData = {
        'wukong': {
          id: 1, documentId: 'wukong-1', title: 'Wukong', 
          description: 'Epic action RPG based on the legendary Monkey King. Experience breathtaking combat and explore a mystical world filled with ancient legends and powerful enemies.',
          fullDescription: 'Embark on an epic journey as the legendary Monkey King in this stunning action RPG. With incredible combat mechanics, breathtaking visuals, and a rich storyline rooted in Chinese mythology, Wukong delivers an unforgettable gaming experience.\n\nFeatures:\n• Fluid combat system with 72 transformations\n• Stunning visuals powered by Unreal Engine\n• Epic boss battles against mythical creatures\n• Rich storytelling based on Journey to the West\n• Customizable abilities and weapons\n• Immersive world exploration',
          category: 'Action', slug: 'wukong', featured: true, downloads: 125000,
          downloadUrl: 'https://goc-cdn.qqby.cn/tg/HihTT_2.6.5.zip',
          bannerImage: { url: 'https://images.unsplash.com/photo-1673350808686-209dc177c898?w=800&h=450&fit=crop' },
          screenshots: [
            { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=338&fit=crop' },
            { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=338&fit=crop' },
            { url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&h=338&fit=crop' }
          ],
          rating: 4.8,
          reviews: 892,
          fileSize: '2.6 GB',
          version: '2.6.5',
          developer: 'Game Science Studio',
          releaseDate: '2024-08-20',
          requirements: 'Android 8.0+ / iOS 12.0+',
          languages: ['English', 'Chinese', 'Japanese', 'Korean']
        },
        'call-me-champion': {
          id: 2, documentId: 'call-me-champion-2', title: 'Call Me Champion',
          description: 'Intense competitive fighting game where you battle to become the ultimate champion.',
          fullDescription: 'Step into the arena and prove yourself in this intense fighting game. With precise controls, diverse fighters, and competitive gameplay, Call Me Champion offers the ultimate fighting experience for mobile devices.\n\nFeatures:\n• 20+ unique fighters with distinct abilities\n• Competitive ranked matches\n• Story mode with epic battles\n• Customizable combos and special moves\n• Online tournaments and events\n• Regular updates with new fighters',
          category: 'Action', slug: 'call-me-champion', featured: true, downloads: 89000,
          downloadUrl: 'https://goc-cdn.qqby.cn/jwgj/ChampionTK_2.2.2.zip',
          bannerImage: { url: 'https://images.unsplash.com/photo-1543622748-5ee7237e8565?w=800&h=450&fit=crop' },
          screenshots: [
            { url: 'https://images.unsplash.com/photo-1673350808686-209dc177c898?w=600&h=338&fit=crop' },
            { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=338&fit=crop' }
          ],
          rating: 4.5,
          reviews: 654,
          fileSize: '1.8 GB',
          version: '2.2.2',
          developer: 'Fighting Studio',
          releaseDate: '2024-07-15',
          requirements: 'Android 7.0+ / iOS 11.0+',
          languages: ['English', 'Spanish', 'Portuguese']
        },
        'civilization': {
          id: 4, documentId: 'civilization-4', title: 'Civilization',
          description: 'Build and expand your empire through the ages.',
          fullDescription: 'Lead your civilization from ancient times to the modern era in this epic strategy game. Build cities, research technologies, wage wars, and make alliances as you compete to build the greatest civilization in history.\n\nFeatures:\n• Deep strategic gameplay\n• Multiple victory conditions\n• Historical leaders and civilizations\n• Technology tree spanning millennia\n• Diplomatic system\n• World wonders and great people',
          category: 'Strategy', slug: 'civilization', featured: true, downloads: 234000,
          downloadUrl: 'https://goc-cdn.qqby.cn/wm/Civilization_tk_1.5.9.zip',
          bannerImage: { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop' },
          screenshots: [
            { url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&h=338&fit=crop' },
            { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=338&fit=crop' }
          ],
          rating: 4.7,
          reviews: 1203,
          fileSize: '3.2 GB',
          version: '1.5.9',
          developer: 'Strategy Masters',
          releaseDate: '2024-06-10',
          requirements: 'Android 9.0+ / iOS 13.0+',
          languages: ['English', 'French', 'German', 'Russian']
        }
      }

      const gameDetail = gameData[slug]
      if (gameDetail) {
        setGame(gameDetail)
      }
    } catch (error) {
      console.error('Error fetching game details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (game?.downloadUrl) {
      window.open(game.downloadUrl, '_blank')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading game details...</div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Game Not Found</h1>
          <p className="text-gray-300 mb-8">The game you're looking for doesn't exist or has been removed.</p>
          <Link href="/catalog">
            <Button>Back to Catalog</Button>
          </Link>
        </div>
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
            <Link href="/trending" className="text-white hover:text-blue-300 transition-colors">Trending Games</Link>
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

      {/* Game Detail Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/catalog" className="inline-flex items-center text-gray-300 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Game Header */}
            <div className="mb-8">
              {game.bannerImage?.url && (
                <div className="aspect-video rounded-lg overflow-hidden mb-6">
                  <Image
                    src={game.bannerImage.url}
                    alt={game.title}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{game.title}</h1>
                  <p className="text-xl text-gray-300">{game.description}</p>
                </div>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {game.category}
                </Badge>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-white font-semibold ml-1">{game.rating}</span>
                  <span className="text-gray-400 ml-1">({game.reviews} reviews)</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Download className="w-4 h-4 mr-1" />
                  {game.downloads.toLocaleString()} downloads
                </div>
              </div>
            </div>

            {/* Screenshots */}
            {game.screenshots && game.screenshots.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Screenshots</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {game.screenshots.map((screenshot, index) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={screenshot.url}
                        alt={`${game.title} screenshot ${index + 1}`}
                        width={600}
                        height={338}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Game Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">About This Game</h2>
              <div className="bg-white/10 rounded-lg p-6">
                <p className="text-gray-300 whitespace-pre-line">{game.fullDescription}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download Card */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Download Game</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleDownload}
                  className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 py-3"
                >
                  <Download className="w-5 h-5" />
                  Download Now
                </Button>
                <p className="text-gray-400 text-sm mt-3 text-center">
                  File Size: {game.fileSize}
                </p>
              </CardContent>
            </Card>

            {/* Game Info */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Game Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-gray-400">Developer:</span>
                  <p className="text-white">{game.developer}</p>
                </div>
                <div>
                  <span className="text-gray-400">Version:</span>
                  <p className="text-white">{game.version}</p>
                </div>
                <div>
                  <span className="text-gray-400">Release Date:</span>
                  <p className="text-white">{formatDate(game.releaseDate)}</p>
                </div>
                <div>
                  <span className="text-gray-400">Requirements:</span>
                  <p className="text-white">{game.requirements}</p>
                </div>
                <div>
                  <span className="text-gray-400">Languages:</span>
                  <p className="text-white">{game.languages.join(', ')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Need Help?</CardTitle>
                <CardDescription className="text-gray-300">
                  Contact us for support or questions about this game.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <a 
                  href="https://web.telegram.org/k/#@behemoth168?text=Halo%2C%20I%20am%20interested%20in%20this%20game%2C%20can%20i%20have%20more%20information%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center block transition-colors"
                >
                  Contact on Telegram
                </a>
                <a 
                  href="https://wa.me/62816339871?text=Halo%2C%20I%20am%20interested%20in%20this%20game%2C%20can%20i%20have%20more%20information%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-center block transition-colors"
                >
                  Contact on WhatsApp
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-12 px-4 mt-16">
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