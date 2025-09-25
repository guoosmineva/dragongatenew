'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function BlogPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      // Mock blog articles
      const blogArticles = [
        {
          id: 1,
          documentId: 'gaming-trends-2025',
          title: 'Top Gaming Trends to Watch in 2025',
          excerpt: 'Discover the latest trends shaping the gaming industry this year, from AI-powered NPCs to immersive virtual worlds that are changing how we play.',
          slug: 'gaming-trends-2025',
          publishedDate: '2025-01-15T10:00:00Z',
          author: 'GameVault Team',
          readTime: '5 min read',
          featuredImage: { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop' },
          tags: ['Trends', 'Gaming', '2025'],
          category: 'Industry News'
        },
        {
          id: 2,
          documentId: 'mobile-gaming-revolution',
          title: 'The Mobile Gaming Revolution: How Smartphones Changed Everything',
          excerpt: 'Explore how mobile gaming has transformed from simple puzzles to complex AAA experiences, and what this means for the future of gaming.',
          slug: 'mobile-gaming-revolution',
          publishedDate: '2025-01-12T14:30:00Z',
          author: 'Sarah Chen',
          readTime: '7 min read',
          featuredImage: { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop' },
          tags: ['Mobile', 'Gaming', 'Technology'],
          category: 'Technology'
        },
        {
          id: 3,
          documentId: 'strategy-games-guide',
          title: 'Mastering Strategy Games: A Beginner\'s Guide',
          excerpt: 'New to strategy games? Learn the fundamentals and discover which games are perfect for beginners looking to dive into the strategic gaming world.',
          slug: 'strategy-games-guide',
          publishedDate: '2025-01-10T09:15:00Z',
          author: 'Mike Rodriguez',
          readTime: '10 min read',
          featuredImage: { url: 'https://images.unsplash.com/photo-1673350808686-209dc177c898?w=400&h=225&fit=crop' },
          tags: ['Strategy', 'Guide', 'Beginner'],
          category: 'Gaming Guide'
        },
        {
          id: 4,
          documentId: 'action-rpg-evolution',
          title: 'The Evolution of Action RPGs: From Classic to Modern',
          excerpt: 'Trace the journey of Action RPGs from their humble beginnings to today\'s spectacular adventures that combine fast-paced action with deep storytelling.',
          slug: 'action-rpg-evolution',
          publishedDate: '2025-01-08T16:45:00Z',
          author: 'Alex Kim',
          readTime: '8 min read',
          featuredImage: { url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=225&fit=crop' },
          tags: ['RPG', 'Action', 'History'],
          category: 'Game History'
        },
        {
          id: 5,
          documentId: 'indie-games-spotlight',
          title: 'Indie Games Spotlight: Hidden Gems You Should Play',
          excerpt: 'Discover amazing independent games that are pushing creative boundaries and delivering unique gaming experiences you won\'t find anywhere else.',
          slug: 'indie-games-spotlight',
          publishedDate: '2025-01-05T11:20:00Z',
          author: 'Emma Watson',
          readTime: '6 min read',
          featuredImage: { url: 'https://images.unsplash.com/photo-1543622748-5ee7237e8565?w=400&h=225&fit=crop' },
          tags: ['Indie', 'Spotlight', 'Reviews'],
          category: 'Game Reviews'
        },
        {
          id: 6,
          documentId: 'gaming-community-building',
          title: 'Building Gaming Communities: The Social Side of Games',
          excerpt: 'Learn how modern games are fostering communities and creating lasting friendships through shared gaming experiences and social features.',
          slug: 'gaming-community-building',
          publishedDate: '2025-01-03T13:10:00Z',
          author: 'GameVault Team',
          readTime: '9 min read',
          featuredImage: { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop' },
          tags: ['Community', 'Social', 'Gaming'],
          category: 'Community'
        }
      ]

      setArticles(blogArticles)
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
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
        <div className="text-white text-xl">Loading articles...</div>
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
            <Link href="/" className="text-white hover:text-blue-300 transition-colors">Home</Link>
            <Link href="/catalog" className="text-white hover:text-blue-300 transition-colors">Catalog</Link>
            <Link href="/trending" className="text-white hover:text-blue-300 transition-colors">Trending Games</Link>
            <Link href="/blog" className="text-blue-300 font-semibold">Blog</Link>
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
            <BookOpen className="w-8 h-8 text-purple-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Gaming Blog</h1>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Stay updated with the latest gaming news, reviews, guides, and industry insights from our expert team.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article.documentId} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all group">
                <CardHeader className="p-0">
                  <div className="aspect-video bg-gray-800 rounded-t-lg overflow-hidden">
                    {article.featuredImage?.url ? (
                      <Image
                        src={article.featuredImage.url}
                        alt={article.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-800 to-gray-900">
                        <BookOpen className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {article.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-lg leading-tight mb-2">{article.title}</CardTitle>
                  <CardDescription className="text-gray-300 mb-4 line-clamp-3 text-sm">
                    {article.excerpt}
                  </CardDescription>
                  
                  {/* Article Meta */}
                  <div className="flex items-center text-gray-400 text-xs mb-4 space-x-4">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {article.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(article.publishedDate)}
                    </div>
                    <div>
                      {article.readTime}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {article.tags?.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-700/50 text-gray-300 text-xs px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link href={`/article/${article.slug}`}>
                    <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 w-full">
                      Read Article
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
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