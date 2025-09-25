import jwt from 'jsonwebtoken'
import { validateAdminUser } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function authenticateAdmin(email, password) {
  const user = await validateAdminUser(email, password)
  if (user) {
    return {
      user,
      token: generateToken(user)
    }
  }
  return null
}

export function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

export function requireAdmin(handler) {
  return async (request, context) => {
    const token = getTokenFromRequest(request)
    
    if (!token) {
      return new Response(JSON.stringify({ error: 'No token provided' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const decoded = verifyToken(token)
    if (!decoded) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Add user info to request context
    context.user = decoded
    return handler(request, context)
  }
}