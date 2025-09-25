'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import Image from 'next/image'

const STRAPI_URL = process.env.NEXT_PUBLIC_BASE_URL

export default function CatalogPage() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const categories = ['Action', 'RPG', 'Strategy', 'Adventure', 'Simulation', 'Puzzle']

  useEffect(() => {
    fetchGames()
  }, [searchQuery, categoryFilter])

  const fetchGames = async () => {
    try {
      let url = `/api/strapi/games`
      
      const params = new URLSearchParams()
      
      // Add search filter
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim())
      }
      
      // Add category filter
      if (categoryFilter) {
        params.append('category', categoryFilter)
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      const data = await response.json()
      setGames(data.data || [])
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
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
            <Link href="/" className="text-white hover:text-blue-300 transition-colors">Home</Link>
            <Link href="/catalog" className="text-blue-300 font-semibold">Catalog</Link>
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

      {/* Page Header */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">Game Catalog</h1>
          <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
            Explore our complete collection of games. Use the search and filters to find your perfect game.
          </p>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search games by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12"
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Info */}
            <div className="text-center mb-8">
              <p className="text-gray-300">
                {loading ? 'Loading...' : `Found ${games.length} games`}
                {searchQuery && ` for "${searchQuery}"`}
                {categoryFilter && ` in ${categoryFilter}`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-white text-xl">Loading games...</div>
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-white text-xl mb-4">No games found</div>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {games.map((game) => (
                <Card key={game.documentId} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all group">
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
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 ml-2 shrink-0">
                        {game.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-300 mb-4 line-clamp-2 text-sm">
                      {game.description}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{(game.downloads || 0).toLocaleString()} downloads</span>
                      <Link href={`/game/${game.slug}`}>
                        <Button variant="outline" size="sm" className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20">
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Image 
                src="https://ik.imagekit.io/meoh789/logo-dgp.png" 
                alt="GameVault Logo" 
                width={32} 
                height={32} 
                className="rounded"
              />
              <span className="text-white text-xl font-bold">GameVault</span>
            </div>
            <p className="text-gray-400">
              © 2025 GameVault. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}