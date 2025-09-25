import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import { getAllGames, getFeaturedGames, searchGames, getGameBySlug, createGame, updateGame, deleteGame, createAdminUser } from '@/lib/db'
import { authenticateAdmin, generateToken, verifyToken, getTokenFromRequest } from '@/lib/auth'

// MongoDB connection (keeping for legacy status endpoints)
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
    
    // =================================
    // ADMIN AUTHENTICATION ROUTES
    // =================================
    
    // Admin login
    if (route === '/admin/login' && method === 'POST') {
      const body = await request.json()
      const { email, password } = body
      
      if (!email || !password) {
        return handleCORS(NextResponse.json(
          { error: "Email and password required" },
          { status: 400 }
        ))
      }
      
      const result = await authenticateAdmin(email, password)
      if (result) {
        return handleCORS(NextResponse.json({
          message: "Login successful",
          token: result.token,
          user: result.user
        }))
      } else {
        return handleCORS(NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        ))
      }
    }
    
    // Create admin user (for initial setup)
    if (route === '/admin/register' && method === 'POST') {
      const body = await request.json()
      const { email, password } = body
      
      if (!email || !password) {
        return handleCORS(NextResponse.json(
          { error: "Email and password required" },
          { status: 400 }
        ))
      }
      
      try {
        const user = await createAdminUser(email, password)
        return handleCORS(NextResponse.json({
          message: "Admin user created successfully",
          user: { id: user.id, email: user.email }
        }))
      } catch (error) {
        return handleCORS(NextResponse.json(
          { error: "Failed to create admin user" },
          { status: 500 }
        ))
      }
    }
    
    // =================================
    // GAMES API ROUTES (Real Database)
    // =================================
    
    // Get all games with filters
    if (route === '/games' && method === 'GET') {
      const search = url.searchParams.get('search')
      const category = url.searchParams.get('category')
      const featured = url.searchParams.get('featured')
      
      try {
        let games
        if (featured === 'true') {
          games = await getFeaturedGames()
        } else {
          games = await searchGames(search, category)
        }
        
        // Transform for frontend compatibility
        const transformedGames = games.map(game => ({
          id: game.id,
          documentId: game.document_id || `game-${game.id}`,
          title: game.title,
          description: game.description,
          category: game.category,
          downloadUrl: game.download_url,
          slug: game.slug,
          featured: game.featured,
          downloads: game.downloads,
          bannerImage: { url: `https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop` }, // Placeholder
          createdAt: game.created_at,
          updatedAt: game.updated_at
        }))
        
        return handleCORS(NextResponse.json({ data: transformedGames }))
      } catch (error) {
        console.error('Database error:', error)
        return handleCORS(NextResponse.json(
          { error: "Failed to fetch games" },
          { status: 500 }
        ))
      }
    }
    
    // Get single game by slug
    if (route.startsWith('/games/') && method === 'GET') {
      const slug = route.split('/games/')[1]
      
      try {
        const game = await getGameBySlug(slug)
        if (!game) {
          return handleCORS(NextResponse.json(
            { error: "Game not found" },
            { status: 404 }
          ))
        }
        
        const transformedGame = {
          id: game.id,
          documentId: game.document_id || `game-${game.id}`,
          title: game.title,
          description: game.description,
          category: game.category,
          downloadUrl: game.download_url,
          slug: game.slug,
          featured: game.featured,
          downloads: game.downloads,
          bannerImage: { url: `https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop` },
          createdAt: game.created_at,
          updatedAt: game.updated_at
        }
        
        return handleCORS(NextResponse.json({ data: transformedGame }))
      } catch (error) {
        console.error('Database error:', error)
        return handleCORS(NextResponse.json(
          { error: "Failed to fetch game" },
          { status: 500 }
        ))
      }
    }
    
    // =================================
    // ADMIN GAMES MANAGEMENT
    // =================================
    
    // Create new game (admin only)
    if (route === '/admin/games' && method === 'POST') {
      const token = getTokenFromRequest(request)
      if (!token || !verifyToken(token)) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const body = await request.json()
      try {
        const game = await createGame(body)
        return handleCORS(NextResponse.json({ 
          message: "Game created successfully",
          data: game 
        }))
      } catch (error) {
        return handleCORS(NextResponse.json(
          { error: "Failed to create game" },
          { status: 500 }
        ))
      }
    }
    
    // Update game (admin only)
    if (route.startsWith('/admin/games/') && method === 'PUT') {
      const token = getTokenFromRequest(request)
      if (!token || !verifyToken(token)) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const gameId = route.split('/admin/games/')[1]
      const body = await request.json()
      
      try {
        const game = await updateGame(parseInt(gameId), body)
        return handleCORS(NextResponse.json({
          message: "Game updated successfully",
          data: game
        }))
      } catch (error) {
        return handleCORS(NextResponse.json(
          { error: "Failed to update game" },
          { status: 500 }
        ))
      }
    }
    
    // Delete game (admin only)
    if (route.startsWith('/admin/games/') && method === 'DELETE') {
      const token = getTokenFromRequest(request)
      if (!token || !verifyToken(token)) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      const gameId = route.split('/admin/games/')[1]
      
      try {
        await deleteGame(parseInt(gameId))
        return handleCORS(NextResponse.json({
          message: "Game deleted successfully"
        }))
      } catch (error) {
        return handleCORS(NextResponse.json(
          { error: "Failed to delete game" },
          { status: 500 }
        ))
      }
    }
    
    // Get all games for admin
    if (route === '/admin/games' && method === 'GET') {
      const token = getTokenFromRequest(request)
      if (!token || !verifyToken(token)) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }
      
      try {
        const games = await getAllGames()
        return handleCORS(NextResponse.json({ data: games }))
      } catch (error) {
        return handleCORS(NextResponse.json(
          { error: "Failed to fetch games" },
          { status: 500 }
        ))
      }
    }

    // =================================
    // LEGACY STRAPI-STYLE ROUTES (for backwards compatibility)
    // =================================
    
    // Mock Strapi Games API
    if (route === '/strapi/games' && method === 'GET') {
      const search = url.searchParams.get('search')
      const category = url.searchParams.get('category')
      const featured = url.searchParams.get('featured')
      
      try {
        let games
        if (featured === 'true') {
          games = await getFeaturedGames()
        } else {
          games = await searchGames(search, category)
        }
        
        // Transform for frontend compatibility with better images
        const imageUrls = [
          'https://images.unsplash.com/photo-1673350808686-209dc177c898?w=400&h=225&fit=crop',
          'https://images.unsplash.com/photo-1543622748-5ee7237e8565?w=400&h=225&fit=crop',
          'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=225&fit=crop',
          'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop',
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop'
        ]
        
        const transformedGames = games.map((game, index) => ({
          id: game.id,
          documentId: game.document_id || `game-${game.id}`,
          title: game.title,
          description: game.description,
          category: game.category,
          downloadUrl: game.download_url,
          slug: game.slug,
          featured: game.featured,
          downloads: game.downloads,
          bannerImage: { url: imageUrls[index % imageUrls.length] },
          createdAt: game.created_at,
          updatedAt: game.updated_at
        }))
        
        return handleCORS(NextResponse.json({ data: transformedGames }))
      } catch (error) {
        console.error('Database error:', error)
        // Fallback to mock data if database fails
        const MOCK_GAMES = [
          {
            id: 1, documentId: 'wukong-1', title: 'Wukong', 
            description: 'Epic action RPG based on the legendary Monkey King.',
            category: 'Action', slug: 'wukong', featured: true, downloads: 125000,
            bannerImage: { url: 'https://images.unsplash.com/photo-1673350808686-209dc177c898?w=400&h=225&fit=crop' }
          }
        ]
        return handleCORS(NextResponse.json({ data: MOCK_GAMES }))
      }
    }

    // Mock Strapi Articles API
    if (route === '/strapi/articles' && method === 'GET') {
      const MOCK_ARTICLES = [
        {
          id: 1,
          documentId: 'gaming-trends-2025',
          title: 'Top Gaming Trends to Watch in 2025',
          excerpt: 'Discover the latest trends shaping the gaming industry this year.',
          slug: 'gaming-trends-2025',
          publishedDate: '2025-01-15T10:00:00Z',
          author: 'GameVault Team',
          featuredImage: { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop' }
        }
      ]
      return handleCORS(NextResponse.json({ data: MOCK_ARTICLES }))
    }

    // Mock single game detail
    if (route.startsWith('/strapi/games/') && method === 'GET') {
      const slug = route.split('/strapi/games/')[1]
      
      try {
        const game = await getGameBySlug(slug)
        if (!game) {
          return handleCORS(NextResponse.json(
            { error: "Game not found" }, 
            { status: 404 }
          ))
        }
        
        const transformedGame = {
          id: game.id,
          documentId: game.document_id || `game-${game.id}`,
          title: game.title,
          description: game.description,
          category: game.category,
          downloadUrl: game.download_url,
          slug: game.slug,
          featured: game.featured,
          downloads: game.downloads,
          bannerImage: { url: `https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop` },
          createdAt: game.created_at,
          updatedAt: game.updated_at
        }
        
        return handleCORS(NextResponse.json({ data: transformedGame }))
      } catch (error) {
        return handleCORS(NextResponse.json(
          { error: "Failed to fetch game" },
          { status: 500 }
        ))
      }
    }

    // =================================
    // LEGACY MONGODB ROUTES
    // =================================
    
    // Original MongoDB routes
    const db = await connectToMongo()

    // Root endpoint - GET /api/root
    if (route === '/root' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: "Hello World" }))
    }
    // Root endpoint - GET /api/
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