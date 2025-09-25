'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Eye, EyeOff, Settings, Plus, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [games, setGames] = useState([])
  const [token, setToken] = useState('')

  useEffect(() => {
    // Check if already logged in
    const savedToken = localStorage.getItem('adminToken')
    if (savedToken) {
      setToken(savedToken)
      setIsLoggedIn(true)
      fetchGames(savedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        setToken(data.token)
        setIsLoggedIn(true)
        localStorage.setItem('adminToken', data.token)
        await fetchGames(data.token)
      } else {
        setLoginError(data.error || 'Login failed')
      }
    } catch (error) {
      setLoginError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchGames = async (authToken) => {
    try {
      const response = await fetch('/api/admin/games', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setGames(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch games:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsLoggedIn(false)
    setToken('')
    setGames([])
    setEmail('')
    setPassword('')
  }

  const handleDeleteGame = async (gameId) => {
    if (!confirm('Are you sure you want to delete this game?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/games/${gameId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setGames(games.filter(game => game.id !== gameId))
        alert('Game deleted successfully!')
      } else {
        alert('Failed to delete game')
      }
    } catch (error) {
      alert('Error deleting game')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Image 
                src="https://ik.imagekit.io/meoh789/logo-dgp.png" 
                alt="GameVault Logo" 
                width={40} 
                height={40} 
                className="rounded"
              />
              <span className="text-white text-xl font-bold ml-3">GameVault</span>
            </div>
            <CardTitle className="text-white text-2xl">Admin Login</CardTitle>
            <CardDescription className="text-gray-300">
              Sign in to manage games and content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gamevault.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {loginError && (
                <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded">
                  {loginError}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-yellow-400 font-semibold"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Default credentials: admin@gamevault.com / GameVault2025!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Admin Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image 
              src="https://ik.imagekit.io/meoh789/logo-dgp.png" 
              alt="GameVault Logo" 
              width={64} 
              height={64} 
              className="rounded"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" className="border-white/20 text-yellow-400 hover:bg-white/10">
                View Site
              </Button>
            </Link>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="border-red-500/30 text-red-400 hover:bg-red-500/20"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Dashboard */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Manage your game catalog and content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Total Games</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-400">{games.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Featured Games</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">
                {games.filter(g => g.featured).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Total Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">
                {games.reduce((total, game) => total + (game.downloads || 0), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">
                {new Set(games.map(g => g.category)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Games Management</h2>
          <Link href="/admin/games/new">
            <Button className="bg-green-600 hover:bg-green-700 text-yellow-400 font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Add New Game
            </Button>
          </Link>
        </div>

        {/* Games Table */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">All Games</CardTitle>
            <CardDescription className="text-gray-300">
              Manage your game catalog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-white font-semibold py-3">Game</th>
                    <th className="text-left text-white font-semibold py-3">Category</th>
                    <th className="text-left text-white font-semibold py-3">Downloads</th>
                    <th className="text-left text-white font-semibold py-3">Featured</th>
                    <th className="text-left text-white font-semibold py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => (
                    <tr key={game.id} className="border-b border-white/10">
                      <td className="py-4">
                        <div>
                          <div className="text-white font-medium">{game.title}</div>
                          <div className="text-gray-400 text-sm">{game.slug}</div>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                          {game.category}
                        </Badge>
                      </td>
                      <td className="py-4 text-gray-300">
                        {(game.downloads || 0).toLocaleString()}
                      </td>
                      <td className="py-4">
                        {game.featured ? (
                          <Badge className="bg-green-500/20 text-green-400">Featured</Badge>
                        ) : (
                          <Badge variant="outline" className="border-gray-500 text-gray-400">Regular</Badge>
                        )}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <Link href={`/game/${game.slug}`}>
                            <Button variant="outline" size="sm" className="border-blue-500/30 text-yellow-400 hover:bg-blue-500/20">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/games/edit/${game.id}`}>
                            <Button variant="outline" size="sm" className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            onClick={() => handleDeleteGame(game.id)}
                            variant="outline" 
                            size="sm" 
                            className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {games.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">No games found</div>
                <Link href="/admin/games/new">
                  <Button className="bg-green-600 hover:bg-green-700 text-yellow-400">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Game
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}