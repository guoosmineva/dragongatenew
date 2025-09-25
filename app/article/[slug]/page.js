'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User, ArrowLeft, Share2, BookOpen } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ArticleDetailPage() {
  const params = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.slug) {
      fetchArticleDetails(params.slug)
    }
  }, [params.slug])

  const fetchArticleDetails = async (slug) => {
    try {
      // Mock article details data
      const articlesData = {
        'gaming-trends-2025': {
          id: 1,
          documentId: 'gaming-trends-2025',
          title: 'Top Gaming Trends to Watch in 2025',
          excerpt: 'Discover the latest trends shaping the gaming industry this year, from AI-powered NPCs to immersive virtual worlds that are changing how we play.',
          content: `# The Gaming Industry is Evolving Rapidly

The gaming industry continues to evolve at breakneck speed, with 2025 bringing exciting new developments that are reshaping how we play, interact, and experience digital entertainment. From artificial intelligence revolutionizing game design to cloud gaming making high-end titles accessible anywhere, this year promises to be transformative for gamers worldwide.

## AI-Powered Game Development

One of the most significant trends we're seeing is the integration of artificial intelligence in game development. AI is no longer just powering NPCs with better decision-making capabilities – it's fundamentally changing how games are created, balanced, and experienced.

**Key developments include:**
- Procedural content generation using machine learning
- Dynamic difficulty adjustment based on player behavior  
- Real-time narrative adaptation
- AI-driven quality assurance and bug detection

## Cloud Gaming Goes Mainstream

Cloud gaming has finally reached a tipping point in 2025. With improved internet infrastructure and more powerful data centers, playing AAA games on any device is becoming a reality for millions of players.

**Major platforms leading the charge:**
- Google Stadia 2.0 with enhanced streaming technology
- Microsoft xCloud integration with Game Pass
- NVIDIA GeForce Now expanding globally
- New regional players entering the market

## The Metaverse Gaming Experience

Virtual worlds are becoming more interconnected, creating shared experiences that blur the lines between gaming, social media, and digital commerce. Players can now carry their avatars, achievements, and virtual assets across multiple games and platforms.

## Sustainable Gaming Practices

Environmental consciousness is driving changes in how games are developed and distributed. Digital-first releases, energy-efficient gaming hardware, and carbon-neutral gaming initiatives are becoming industry standards.

## Looking Ahead

As we progress through 2025, these trends will continue to mature and intersect in fascinating ways. The gaming industry's ability to adapt and innovate ensures that the best is yet to come for gamers everywhere.

*What gaming trends are you most excited about? Share your thoughts with us on social media!*`,
          slug: 'gaming-trends-2025',
          publishedDate: '2025-01-15T10:00:00Z',
          author: 'GameVault Team',
          readTime: '5 min read',
          featuredImage: { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop' },
          tags: ['Trends', 'Gaming', '2025'],
          category: 'Industry News'
        },
        'mobile-gaming-revolution': {
          id: 2,
          documentId: 'mobile-gaming-revolution',
          title: 'The Mobile Gaming Revolution: How Smartphones Changed Everything',
          excerpt: 'Explore how mobile gaming has transformed from simple puzzles to complex AAA experiences, and what this means for the future of gaming.',
          content: `# From Snake to Stunning: The Mobile Gaming Journey

Remember when the most sophisticated game on your phone was Snake? Those days feel like ancient history now that our smartphones pack more processing power than desktop computers from just a decade ago. The mobile gaming revolution hasn't just changed how we play – it's fundamentally altered the entire gaming landscape.

## The Numbers Don't Lie

Mobile gaming now represents over 50% of the global gaming market, generating more revenue than console and PC gaming combined. With over 3 billion mobile gamers worldwide, the reach and impact of mobile gaming cannot be overstated.

**Market Statistics:**
- $95+ billion in mobile gaming revenue in 2024
- Average smartphone user plays games 7+ hours per week
- 78% of mobile game revenue comes from in-app purchases
- Asia-Pacific leads with 1.4+ billion mobile gamers

## Technical Evolution

The journey from basic 2D sprites to console-quality 3D graphics on mobile devices has been remarkable. Modern smartphones now feature:

- Dedicated gaming processors and GPU cores
- High refresh rate displays (120Hz+)  
- Advanced cooling systems
- 5G connectivity for seamless multiplayer experiences

## Changing Player Demographics

Mobile gaming has democratized gaming, bringing interactive entertainment to demographics that traditional gaming never reached:

- **Age diversity:** Players range from children to seniors
- **Gender balance:** Nearly 50/50 male-female split
- **Global reach:** Available in markets where consoles are rare
- **Accessibility:** Lower barrier to entry than traditional gaming

## Business Model Revolution

The shift to free-to-play models with in-app purchases has created sustainable revenue streams while making games accessible to everyone. This has led to:

- Live service games with regular content updates
- Community-driven gameplay experiences  
- Cross-platform play becoming standard
- Social features integrated into core gameplay

## What's Next?

As 5G networks expand and mobile hardware continues advancing, we can expect:
- Cloud gaming integration eliminating storage limitations
- AR/VR experiences becoming mainstream on mobile
- AI-powered personalized gaming experiences
- Deeper integration with IoT and smart home devices

The mobile gaming revolution is far from over – it's just getting started.`,
          slug: 'mobile-gaming-revolution',
          publishedDate: '2025-01-12T14:30:00Z',
          author: 'Sarah Chen',
          readTime: '7 min read',
          featuredImage: { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop' },
          tags: ['Mobile', 'Gaming', 'Technology'],
          category: 'Technology'
        },
        'strategy-games-guide': {
          id: 3,
          documentId: 'strategy-games-guide',
          title: 'Mastering Strategy Games: A Beginner\'s Guide',
          excerpt: 'New to strategy games? Learn the fundamentals and discover which games are perfect for beginners looking to dive into the strategic gaming world.',
          content: `# Your Journey into Strategic Gaming Starts Here

Strategy games can seem intimidating at first glance – with complex systems, multiple layers of decision-making, and seemingly endless possibilities. But don't let that scare you away! With the right approach and understanding of core concepts, anyone can become a strategic gaming master.

## Understanding Strategy Game Types

Strategy games come in many flavors, each with unique characteristics:

### Real-Time Strategy (RTS)
- Action happens continuously
- Quick decision-making required
- Examples: StarCraft, Age of Empires
- Best for: Players who enjoy fast-paced action

### Turn-Based Strategy (TBS)  
- Take your time to plan each move
- Deep strategic thinking encouraged
- Examples: Civilization, XCOM
- Best for: Thoughtful, methodical players

### Grand Strategy
- Long-term empire management
- Complex diplomatic systems
- Examples: Europa Universalis, Crusader Kings
- Best for: History buffs and patient gamers

## Essential Strategic Concepts

### Resource Management
Every strategy game revolves around managing limited resources efficiently:
- **Economy:** Build income-generating structures early
- **Population:** Balance growth with infrastructure needs  
- **Military:** Maintain adequate defenses without overspending
- **Technology:** Research upgrades that support your strategy

### The Art of Planning

Successful strategic gaming requires thinking several moves ahead:

1. **Short-term goals** (next 1-3 turns/minutes)
2. **Medium-term objectives** (5-10 turns/minutes)  
3. **Long-term vision** (entire game strategy)

### Information is Power
- Scout enemy positions and capabilities
- Understand the game's victory conditions
- Learn from each defeat to improve your strategy
- Watch replays of successful players

## Beginner-Friendly Games to Start With

### Civilization VI
- Turn-based gameplay allows thoughtful decisions
- Excellent tutorial system
- Multiple victory paths to explore
- Strong modding community for extended play

### Age of Empires II: Definitive Edition
- Classic RTS with modern quality-of-life improvements
- Comprehensive campaigns teach historical strategy
- Active competitive scene with learning resources
- Balanced civilizations offer varied playstyles

### Total War: Warhammer III
- Combines turn-based campaign with real-time battles
- Fantasy setting makes it accessible to newcomers
- Excellent visual feedback for learning
- Multiple difficulty settings for gradual improvement

## Tips for New Strategy Gamers

### Start Small
- Play tutorial campaigns completely
- Begin with easier difficulty settings
- Focus on one strategy at a time
- Don't worry about optimal play initially

### Learn from Failure
- Every loss is a learning opportunity
- Analyze what went wrong after each game
- Watch replays to spot missed opportunities
- Join online communities for advice and tips

### Practice Core Skills
- **Multitasking:** Managing multiple priorities simultaneously
- **Pattern recognition:** Identifying threats and opportunities quickly  
- **Resource optimization:** Getting maximum value from limited assets
- **Adaptability:** Adjusting strategy based on changing circumstances

## Building Your Strategic Mindset

The most important skill in strategy gaming isn't memorizing build orders or unit counters – it's developing strategic thinking that applies across all games in the genre.

**Key principles:**
- Always have a plan, but be ready to adapt
- Information gathering is never wasted time
- Economic strength often trumps military might
- Patience usually beats aggression

## Advanced Concepts to Explore Later

Once you're comfortable with the basics, these advanced topics will take your game to the next level:
- Multi-resource economies and trade-offs
- Military unit composition and counters
- Diplomatic relationships and alliance building
- Map control and territorial advantages
- Psychological warfare and misdirection

Remember, becoming proficient at strategy games is a journey, not a destination. Every game teaches new lessons, and even experienced players continue learning and adapting their strategies.

Welcome to the wonderful world of strategic gaming – your empire awaits!`,
          slug: 'strategy-games-guide',
          publishedDate: '2025-01-10T09:15:00Z',
          author: 'Mike Rodriguez',
          readTime: '10 min read',
          featuredImage: { url: 'https://images.unsplash.com/photo-1673350808686-209dc177c898?w=800&h=400&fit=crop' },
          tags: ['Strategy', 'Guide', 'Beginner'],
          category: 'Gaming Guide'
        }
      }

      const articleDetail = articlesData[slug]
      if (articleDetail) {
        setArticle(articleDetail)
      }
    } catch (error) {
      console.error('Error fetching article details:', error)
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

  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      })
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Article URL copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading article...</div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-gray-300 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link href="/blog">
            <Button>Back to Blog</Button>
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

      {/* Article Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/blog" className="inline-flex items-center text-gray-300 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            {article.featuredImage?.url && (
              <div className="aspect-video rounded-lg overflow-hidden mb-6">
                <Image
                  src={article.featuredImage.url}
                  alt={article.title}
                  width={800}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                {article.category}
              </Badge>
              {article.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-700/50 text-gray-300 text-xs px-2 py-1 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {article.title}
            </h1>

            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              {article.excerpt}
            </p>

            {/* Article Meta */}
            <div className="flex items-center justify-between mb-8 p-6 bg-white/5 rounded-lg">
              <div className="flex items-center text-gray-300 space-x-6">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {article.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(article.publishedDate)}
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {article.readTime}
                </div>
              </div>
              
              <Button 
                onClick={handleShare}
                variant="outline" 
                size="sm" 
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg prose-invert max-w-none">
            <div className="bg-white/10 rounded-lg p-8">
              <div className="text-gray-100 whitespace-pre-line leading-relaxed">
                {article.content}
              </div>
            </div>
          </div>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold mb-2">Share this article</h3>
                <p className="text-gray-400 text-sm">Help others discover great gaming content</p>
              </div>
              <Button 
                onClick={handleShare}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Article
              </Button>
            </div>
          </footer>
        </article>
      </div>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-12 px-4 mt-16">
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