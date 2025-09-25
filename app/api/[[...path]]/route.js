import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

// MongoDB connection
let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

// Mock game data for demo
const MOCK_GAMES = [
  {
    id: 1,
    documentId: 'wukong-1',
    title: 'Wukong',
    description: 'Epic action RPG based on the legendary Monkey King. Experience breathtaking combat and explore a mystical world filled with ancient legends and powerful enemies.',
    category: 'Action',
    downloadUrl: 'https://goc-cdn.qqby.cn/tg/HihTT_2.6.5.zip',
    slug: 'wukong',
    featured: true,
    downloads: 125000,
    bannerImage: { url: 'https://images.unsplash.com/photo-1673350808686-209dc177c898?w=400&h=225&fit=crop' },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 2,
    documentId: 'call-me-champion-2',
    title: 'Call Me Champion',
    description: 'Intense competitive fighting game where you battle to become the ultimate champion. Master various fighting styles and defeat opponents in epic tournaments.',
    category: 'Action',
    downloadUrl: 'https://goc-cdn.qqby.cn/jwgj/ChampionTK_2.2.2.zip',
    slug: 'call-me-champion',
    featured: true,
    downloads: 89000,
    bannerImage: { url: 'https://images.unsplash.com/photo-1543622748-5ee7237e8565?w=400&h=225&fit=crop' },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 3,
    documentId: 'dragonball-showdown-3',
    title: 'Dragonball Showdown',
    description: 'High-energy fighting game featuring your favorite Dragon Ball characters. Unleash devastating attacks and experience the ultimate anime fighting experience.',
    category: 'Action',
    downloadUrl: 'https://qqby-goc-hangzhou.oss-cn-hangzhou.aliyuncs.com/lzTK/DragonBall_tk_v1.0.3.zip',
    slug: 'dragonball-showdown',
    featured: true,
    downloads: 156000,
    bannerImage: { url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=225&fit=crop' },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 4,
    documentId: 'civilization-4',
    title: 'Civilization',
    description: 'Build and expand your empire through the ages. Develop technologies, wage wars, and lead your civilization to greatness in this epic strategy game.',
    category: 'Strategy',
    downloadUrl: 'https://goc-cdn.qqby.cn/wm/Civilization_tk_1.5.9.zip',
    slug: 'civilization',
    featured: true,
    downloads: 234000,
    bannerImage: { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop' },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 5,
    documentId: 'clash-of-clans-5',
    title: 'Clash of Clans',
    description: 'The classic strategy game where you build your village, train troops, and battle other players. Join clans and participate in epic clan wars.',
    category: 'Strategy',
    downloadUrl: 'https://qqby-goc-hk.oss-cn-hongkong.aliyuncs.com/blct/blctTT_1.0.10.zip',
    slug: 'clash-of-clans',
    featured: true,
    downloads: 456000,
    bannerImage: { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop' },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 6,
    documentId: 'jiang-hu-6',
    title: 'Jiang Hu',
    description: 'Immersive martial arts RPG set in ancient China. Master kung fu techniques, explore vast landscapes, and forge your legend in the world of martial arts.',
    category: 'RPG',
    downloadUrl: 'https://goc-cdn.qqby.cn/jh/JiangHu_tk_v1.0.18.zip',
    slug: 'jiang-hu',
    featured: false,
    downloads: 67000,
    bannerImage: null,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
]

const MOCK_ARTICLES = [
  {
    id: 1,
    documentId: 'gaming-trends-2025',
    title: 'Top Gaming Trends to Watch in 2025',
    excerpt: 'Discover the latest trends shaping the gaming industry this year, from AI-powered NPCs to immersive virtual worlds.',
    slug: 'gaming-trends-2025',
    publishedDate: '2025-01-15T10:00:00Z',
    author: 'GameVault Team',
    featuredImage: { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop' },
    content: 'Full article content here...'
  }
]

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method
  const url = new URL(request.url)

  try {
    // Mock Strapi Games API
    if (route === '/strapi/games' && method === 'GET') {
      const search = url.searchParams.get('search')
      const category = url.searchParams.get('category')
      const featured = url.searchParams.get('featured')
      
      let filteredGames = MOCK_GAMES

      // Apply search filter
      if (search) {
        filteredGames = filteredGames.filter(game => 
          game.title.toLowerCase().includes(search.toLowerCase())
        )
      }

      // Apply category filter
      if (category) {
        filteredGames = filteredGames.filter(game => game.category === category)
      }

      // Apply featured filter
      if (featured === 'true') {
        filteredGames = filteredGames.filter(game => game.featured === true)
      }

      return handleCORS(NextResponse.json({ data: filteredGames }))
    }

    // Mock Strapi Articles API
    if (route === '/strapi/articles' && method === 'GET') {
      return handleCORS(NextResponse.json({ data: MOCK_ARTICLES }))
    }

    // Mock single game detail
    if (route.startsWith('/strapi/games/') && method === 'GET') {
      const slug = route.split('/strapi/games/')[1]
      const game = MOCK_GAMES.find(g => g.slug === slug)
      
      if (!game) {
        return handleCORS(NextResponse.json(
          { error: "Game not found" }, 
          { status: 404 }
        ))
      }
      
      return handleCORS(NextResponse.json({ data: game }))
    }

    // Original MongoDB routes
    const db = await connectToMongo()

    // Root endpoint - GET /api/root (since /api/ is not accessible with catch-all)
    if (route === '/root' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: "Hello World" }))
    }
    // Root endpoint - GET /api/root (since /api/ is not accessible with catch-all)
    if (route === '/' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: "Hello World" }))
    }

    // Status endpoints - POST /api/status
    if (route === '/status' && method === 'POST') {
      const body = await request.json()
      
      if (!body.client_name) {
        return handleCORS(NextResponse.json(
          { error: "client_name is required" }, 
          { status: 400 }
        ))
      }

      const statusObj = {
        id: uuidv4(),
        client_name: body.client_name,
        timestamp: new Date()
      }

      await db.collection('status_checks').insertOne(statusObj)
      return handleCORS(NextResponse.json(statusObj))
    }

    // Status endpoints - GET /api/status
    if (route === '/status' && method === 'GET') {
      const statusChecks = await db.collection('status_checks')
        .find({})
        .limit(1000)
        .toArray()

      // Remove MongoDB's _id field from response
      const cleanedStatusChecks = statusChecks.map(({ _id, ...rest }) => rest)
      
      return handleCORS(NextResponse.json(cleanedStatusChecks))
    }

    // Route not found
    return handleCORS(NextResponse.json(
      { error: `Route ${route} not found` }, 
      { status: 404 }
    ))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    ))
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute