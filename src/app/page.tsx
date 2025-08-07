'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowRight, 
  User, 
  Wallet, 
  Gift, 
  TrendingUp, 
  Users, 
  Star,
  Phone,
  Shield,
  Crown,
  LogOut,
  Menu,
  X,
  MessageCircle,
  DollarSign,
  FileText,
  Share2,
  Globe,
  Download,
  Volume2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface User {
  id: string
  email: string
  mobile?: string
  name?: string
  isActive: boolean
  wallet?: {
    balance: number
    bonus: number
  }
}

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState<'success' | 'error'>('success')

  const WHATSAPP_NUMBER = '7015187070'

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
        setIsAuthenticated(true)
        setShowLogin(false)
        setAlertMessage('Login successful!')
        setAlertType('success')
        setShowAlert(true)
      } else {
        setAlertMessage(data.error || 'Login failed')
        setAlertType('error')
        setShowAlert(true)
      }
    } catch (error) {
      console.error('Login error:', error)
      setAlertMessage('Network error. Please try again.')
      setAlertType('error')
      setShowAlert(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (registerData.password !== registerData.confirmPassword) {
      setAlertMessage('Passwords do not match')
      setAlertType('error')
      setShowAlert(true)
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
        setIsAuthenticated(true)
        setShowRegister(false)
        setAlertMessage('Registration successful!')
        setAlertType('success')
        setShowAlert(true)
      } else {
        setAlertMessage(data.error || 'Registration failed')
        setAlertType('error')
        setShowAlert(true)
      }
    } catch (error) {
      console.error('Registration error:', error)
      setAlertMessage('Network error. Please try again.')
      setAlertType('error')
      setShowAlert(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    setAlertMessage('Logged out successfully')
    setAlertType('success')
    setShowAlert(true)
  }

  const openWhatsApp = (message: string = '') => {
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank')
  }

  const handleStartEarning = () => {
    const message = isAuthenticated 
      ? `Hi Future Plus team! I'm ${user?.name || user?.email} and I want to start earning. Please guide me through the process.`
      : `Hi Future Plus team! I'm interested in starting to earn with your platform. Please help me get started.`
    openWhatsApp(message)
  }

  // Icon grid items with specific colors and functions
  const iconGridItems = [
    {
      icon: <DollarSign className="w-8 h-8" />,
      label: "Recharge",
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => {
        console.log("Navigating to wallet for recharge...")
        router.push('/wallet')
      }
    },
    {
      icon: <FileText className="w-8 h-8" />,
      label: "Withdrawal",
      color: "bg-red-500 hover:bg-red-600",
      action: () => {
        console.log("Navigating to wallet for withdrawal...")
        router.push('/wallet')
      }
    },
    {
      icon: <Users className="w-8 h-8" />,
      label: "Team",
      color: "bg-orange-500 hover:bg-orange-600",
      action: () => {
        console.log("Navigating to team page...")
        router.push('/team')
      }
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      label: "Referral",
      color: "bg-orange-400 hover:bg-orange-500",
      action: () => {
        console.log("Navigating to referral page...")
        router.push('/referral')
      }
    },
    {
      icon: <Globe className="w-8 h-8" />,
      label: "About Us",
      color: "bg-green-500 hover:bg-green-600",
      action: () => {
        console.log("Navigating to about page...")
        router.push('/about')
      }
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      label: "My Package",
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => {
        console.log("Navigating to plans page...")
        router.push('/plans')
      }
    },
    {
      icon: <Gift className="w-8 h-8" />,
      label: "Gift",
      color: "bg-teal-400 hover:bg-teal-500",
      action: () => {
        console.log("Navigating to gift page...")
        router.push('/gift')
      }
    },
    {
      icon: <Download className="w-8 h-8" />,
      label: "My APP",
      color: "bg-teal-500 hover:bg-teal-600",
      action: () => {
        console.log("Opening WhatsApp for app download...")
        openWhatsApp(`Hi Future Plus team! I want to download the Future Plus app. Please send me the download link.`)
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Alert */}
      {showAlert && (
        <div className="fixed top-4 left-4 right-4 z-50">
          <Alert className={`${alertType === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <AlertDescription className={alertType === 'success' ? 'text-green-800' : 'text-red-800'}>
              {alertMessage}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Future Plus</h1>
              <p className="text-xs text-green-100">Earn Daily</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" className="text-white hover:bg-green-700" onClick={() => router.push('/wallet')}>
                  <Wallet className="w-4 h-4 mr-2" />
                  Wallet
                </Button>
                <Button variant="ghost" className="text-white hover:bg-green-700" onClick={() => router.push('/plans')}>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Plans
                </Button>
                <Button variant="ghost" className="text-white hover:bg-green-700" onClick={() => router.push('/admin')}>
                  <Crown className="w-4 h-4 mr-2" />
                  Admin
                </Button>
                <Button variant="ghost" className="text-white hover:bg-green-700" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="text-white hover:bg-green-700" onClick={() => setShowLogin(true)}>
                  Login
                </Button>
                <Button variant="ghost" className="text-white hover:bg-green-700" onClick={() => setShowRegister(true)}>
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" className="text-white hover:bg-green-700 justify-start" onClick={() => router.push('/wallet')}>
                    <Wallet className="w-4 h-4 mr-2" />
                    Wallet
                  </Button>
                  <Button variant="ghost" className="text-white hover:bg-green-700 justify-start" onClick={() => router.push('/plans')}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Plans
                  </Button>
                  <Button variant="ghost" className="text-white hover:bg-green-700 justify-start" onClick={() => router.push('/admin')}>
                    <Crown className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                  <Button variant="ghost" className="text-white hover:bg-green-700 justify-start" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="text-white hover:bg-green-700 justify-start" onClick={() => setShowLogin(true)}>
                    Login
                  </Button>
                  <Button variant="ghost" className="text-white hover:bg-green-700 justify-start" onClick={() => setShowRegister(true)}>
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Notification Bar */}
      <div className="bg-white mx-4 mt-4 rounded-lg shadow-sm p-3 flex items-center space-x-3">
        <Volume2 className="w-5 h-5 text-green-600 flex-shrink-0" />
        <p className="text-sm text-gray-700">Welcome to Future Plus! Earn ₹500-₹2000 daily with our microtask platform.</p>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* User Balance Section */}
        {isAuthenticated && user && (
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Welcome back!</p>
                <h3 className="text-xl font-bold">{user.name || user.email}</h3>
              </div>
              <div className="text-right">
                <p className="text-green-100 text-sm">Total Balance</p>
                <p className="text-2xl font-bold">₹{(user.wallet?.balance || 0).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <p className="text-green-100 text-xs">Main Balance</p>
                <p className="font-semibold">₹{(user.wallet?.balance || 0).toLocaleString()}</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <p className="text-green-100 text-xs">Bonus Balance</p>
                <p className="font-semibold">₹{(user.wallet?.bonus || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Icon Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {iconGridItems.map((item, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault()
                try {
                  console.log(`Button clicked: ${item.label}`)
                  item.action()
                } catch (error) {
                  console.error(`Navigation error for ${item.label}:`, error)
                  setAlertMessage(`Navigation error. Please try again.`)
                  setAlertType('error')
                  setShowAlert(true)
                }
              }}
              className={`${item.color} rounded-2xl p-4 flex flex-col items-center justify-center space-y-2 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
            >
              {item.icon}
              <span className="text-xs font-medium text-center">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Hero Illustration Section */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Start Your Earning Journey</h2>
            <p className="text-blue-100 mb-6">Join thousands of Indians earning daily with Future Plus. Simple tasks, big rewards!</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full"
                onClick={handleStartEarning}
              >
                Start Earning Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:bg-opacity-20 font-semibold py-3 px-8 rounded-full"
                onClick={() => openWhatsApp('Hi Future Plus team! I have some questions about your platform.')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat Support
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -ml-12 -mb-12"></div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-green-600">10,000+</p>
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-600">₹50L+</p>
            <p className="text-sm text-gray-600">Daily Payouts</p>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <div className="bg-green-600 rounded-2xl p-6 text-center text-white">
          <h3 className="text-lg font-bold mb-2">Need Help?</h3>
          <p className="text-green-100 text-sm mb-4">Our support team is available 24/7</p>
          <Button 
            size="lg" 
            className="bg-white text-green-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-full"
            onClick={() => openWhatsApp('Hi Future Plus team! I need help with your platform.')}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat on WhatsApp
          </Button>
          <p className="text-green-100 text-xs mt-2">{WHATSAPP_NUMBER}</p>
        </div>
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Login</h2>
              <button onClick={() => setShowLogin(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button 
                  onClick={() => {
                    setShowLogin(false)
                    setShowRegister(true)
                  }}
                  className="text-green-600 hover:underline"
                >
                  Register here
                </button>
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Register</h2>
              <button onClick={() => setShowRegister(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">Full Name</Label>
                <Input
                  id="reg-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="Enter your email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-mobile">Mobile Number</Label>
                <Input
                  id="reg-mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={registerData.mobile}
                  onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="Enter your password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button 
                  onClick={() => {
                    setShowRegister(false)
                    setShowLogin(true)
                  }}
                  className="text-green-600 hover:underline"
                >
                  Login here
                </button>
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}