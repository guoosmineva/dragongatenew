// Database connection utility for admin operations
import pkg from 'pg'
const { Client } = pkg

const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'game_catalog_db', 
  user: 'strapi_user',
  password: 'secure_password_123',
}

export async function connectDB() {
  const client = new Client(dbConfig)
  await client.connect()
  return client
}

export async function getAllGames() {
  const client = await connectDB()
  try {
    const result = await client.query(`
      SELECT id, document_id, title, description, category, download_url, 
             slug, featured, downloads, created_at, updated_at, published_at 
      FROM games 
      WHERE published_at IS NOT NULL
      ORDER BY created_at DESC
    `)
    return result.rows
  } finally {
    await client.end()
  }
}

export async function getGameBySlug(slug) {
  const client = await connectDB()
  try {
    const result = await client.query(`
      SELECT id, document_id, title, description, category, download_url, 
             slug, featured, downloads, created_at, updated_at, published_at 
      FROM games 
      WHERE slug = $1 AND published_at IS NOT NULL
    `, [slug])
    return result.rows[0] || null
  } finally {
    await client.end()
  }
}

export async function getFeaturedGames() {
  const client = await connectDB()
  try {
    const result = await client.query(`
      SELECT id, document_id, title, description, category, download_url, 
             slug, featured, downloads, created_at, updated_at, published_at 
      FROM games 
      WHERE featured = true AND published_at IS NOT NULL
      ORDER BY downloads DESC
      LIMIT 6
    `)
    return result.rows
  } finally {
    await client.end()
  }
}

export async function searchGames(searchQuery, categoryFilter) {
  const client = await connectDB()
  try {
    let query = `
      SELECT id, document_id, title, description, category, download_url, 
             slug, featured, downloads, created_at, updated_at, published_at 
      FROM games 
      WHERE published_at IS NOT NULL
    `
    const params = []
    
    if (searchQuery) {
      query += ` AND title ILIKE $${params.length + 1}`
      params.push(`%${searchQuery}%`)
    }
    
    if (categoryFilter && categoryFilter !== 'all') {
      query += ` AND category = $${params.length + 1}`
      params.push(categoryFilter)
    }
    
    query += ` ORDER BY downloads DESC`
    
    const result = await client.query(query, params)
    return result.rows
  } finally {
    await client.end()
  }
}

export async function createGame(gameData) {
  const client = await connectDB()
  try {
    const result = await client.query(`
      INSERT INTO games (
        title, description, category, download_url, slug, 
        featured, downloads, created_at, updated_at, published_at, locale
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW(), 'en')
      RETURNING *
    `, [
      gameData.title,
      gameData.description,
      gameData.category,
      gameData.downloadUrl,
      gameData.slug,
      gameData.featured || false,
      gameData.downloads || 0
    ])
    return result.rows[0]
  } finally {
    await client.end()
  }
}

export async function updateGame(id, gameData) {
  const client = await connectDB()
  try {
    const result = await client.query(`
      UPDATE games SET
        title = $1, description = $2, category = $3, download_url = $4,
        slug = $5, featured = $6, downloads = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `, [
      gameData.title,
      gameData.description,
      gameData.category,
      gameData.downloadUrl,
      gameData.slug,
      gameData.featured || false,
      gameData.downloads || 0,
      id
    ])
    return result.rows[0]
  } finally {
    await client.end()
  }
}

export async function deleteGame(id) {
  const client = await connectDB()
  try {
    await client.query('DELETE FROM games WHERE id = $1', [id])
    return true
  } finally {
    await client.end()
  }
}

// Admin authentication helpers
export async function createAdminUser(email, password) {
  const bcrypt = await import('bcryptjs')
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const client = await connectDB()
  try {
    const result = await client.query(`
      INSERT INTO admin_users (firstname, lastname, email, password, is_active, created_at, updated_at, published_at)
      VALUES ('Admin', 'User', $1, $2, true, NOW(), NOW(), NOW())
      RETURNING id, email
    `, [email, hashedPassword])
    return result.rows[0]
  } finally {
    await client.end()
  }
}

export async function validateAdminUser(email, password) {
  const bcrypt = await import('bcryptjs')
  
  const client = await connectDB()
  try {
    const result = await client.query(`
      SELECT id, email, password FROM admin_users WHERE email = $1 AND is_active = true
    `, [email])
    
    if (result.rows.length === 0) {
      return null
    }
    
    const user = result.rows[0]
    const isValid = await bcrypt.compare(password, user.password)
    
    if (isValid) {
      return { id: user.id, email: user.email }
    }
    
    return null
  } finally {
    await client.end()
  }
}