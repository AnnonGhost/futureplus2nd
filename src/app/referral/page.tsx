'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Users, 
  Share2, 
  Copy, 
  Gift,
  TrendingUp,
  CheckCircle,
  MessageCircle,
  Phone,
  Crown,
  Star,
  IndianRupee
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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

interface Referral {
  id: string
  code: string
  bonus: number
  status: string
  referred: {
    name: string
    email: string
  }
  createdAt: string
}

export default function ReferralPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [referralCode, setReferralCode] = useState('')
  const [referralLink, setReferralLink] = useState('')
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
        fetchReferralData(parsedUser.id)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      }
    }
    // Don't redirect - allow users to view referral info without login
    // Show demo data for non-logged in users
    setReferralCode('DEMO123')
    setReferralLink('https://futureplus.vercel.app?ref=DEMO123')
    setReferrals([
      {
        id: '1',
        code: 'DEMO123',
        bonus: 500,
        status: 'COMPLETED',
        referred: {
          name: 'Demo User',
          email: 'demo@example.com'
        },
        createdAt: new Date().toISOString()
      }
    ])
  }, [router])

  const fetchReferralData = async (userId: string) => {
    try {
      // Fetch referrals
      const response = await fetch(`/api/referral?userId=${userId}`)
      const data = await response.json()
      if (response.ok) {
        setReferrals(data.referrals || [])
        setReferralCode(data.referralCode || '')
        setReferralLink(data.referralLink || '')
      }
    } catch (error) {
      console.error('Error fetching referral data:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setAlertMessage('Copied to clipboard!')
    setAlertType('success')
    setShowAlert(true)
  }

  const shareOnWhatsApp = () => {
    const message = `🌟 Join Future Plus and start earning today! 🌟\n\nUse my referral link to sign up and get exclusive benefits:\n\n${referralLink}\n\n✅ Daily earnings up to ₹2000\n✅ Secure platform\n✅ 24/7 support\n✅ Exciting rewards\n\nJoin now and start your journey to financial freedom! 💰`
    
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleReferralBonus = () => {
    if (!user) {
      setAlertMessage('Please login to claim referral bonus')
      setAlertType('error')
      setShowAlert(true)
      setTimeout(() => router.push('/'), 1000)
      return
    }

    const message = `Hi Future Plus team! I want to claim my referral bonus.\n\nDetails:\nName: ${user.name || user.email}\nEmail: ${user.email}\nReferral Code: ${referralCode}\nTotal Referrals: ${referrals.length}\n\nPlease process my referral bonus.`
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank')
    
    setAlertMessage('Referral bonus claim request sent to WhatsApp. Our team will assist you shortly!')
    setAlertType('success')
    setShowAlert(true)
  }

  const openWhatsApp = (message: string = '') => {
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100'
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100'
      case 'CANCELLED':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  // Allow all users to view referral page, but some actions require login
  const canPerformActions = !!user;

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
        <div className="flex items-center space-x-3">
          <button onClick={() => router.push('/')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6" />
            <h1 className="text-xl font-bold">Referral Program</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Referral Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{referrals.length}</p>
            <p className="text-sm text-gray-600">Total Referrals</p>
          </Card>
          
          <Card className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {referrals.filter(r => r.status === 'COMPLETED').length}
            </p>
            <p className="text-sm text-gray-600">Successful</p>
          </Card>
          
          <Card className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <IndianRupee className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ₹{referrals.reduce((sum, r) => sum + r.bonus, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Bonus</p>
          </Card>
          
          <Card className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Crown className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">₹500</p>
            <p className="text-sm text-gray-600">Per Referral</p>
          </Card>
        </div>

        {/* Referral Code & Link */}
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold mb-2">Your Referral Code</h2>
            <p className="text-purple-100">Share this code with your friends and earn bonuses</p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-100">Referral Code:</span>
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => copyToClipboard(referralCode)}
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-purple-600 font-mono text-lg font-bold text-center">
                  {referralCode || 'LOADING...'}
                </p>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-100">Referral Link:</span>
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => copyToClipboard(referralLink)}
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-purple-600 text-sm break-all">
                  {referralLink || 'LOADING...'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button 
              className="flex-1 bg-white text-purple-600 hover:bg-gray-100 font-semibold"
              onClick={shareOnWhatsApp}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share on WhatsApp
            </Button>
            <Button 
              className="flex-1 bg-yellow-400 text-purple-900 hover:bg-yellow-300 font-semibold"
              onClick={handleReferralBonus}
            >
              <Gift className="w-4 h-4 mr-2" />
              Claim Bonus
            </Button>
          </div>
        </Card>

        {/* My Referrals */}
        <Card className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">My Referrals</h2>
            <Button variant="outline" size="sm" onClick={() => fetchReferralData(user.id)}>
              Refresh
            </Button>
          </div>
          
          {referrals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">You haven't referred anyone yet</p>
              <Button 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={shareOnWhatsApp}
              >
                Start Referring Now
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{referral.referred.name}</p>
                      <p className="text-sm text-gray-600">{referral.referred.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(referral.status)}`}>
                      {referral.status}
                    </span>
                    <p className="text-sm font-medium text-green-600 mt-1">
                      +₹{referral.bonus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* How It Works */}
        <Card className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">How Referral Program Works</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Share Your Link</h3>
              <p className="text-sm text-gray-600">Share your referral code with friends and family</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">They Join</h3>
              <p className="text-sm text-gray-600">They sign up using your referral link</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Earn Bonus</h3>
              <p className="text-sm text-gray-600">Get ₹500 bonus for each successful referral</p>
            </div>
          </div>
        </Card>

        {/* Benefits */}
        <Card className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Referral Benefits</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <IndianRupee className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Generous Commissions</h3>
                <p className="text-sm text-gray-600">Earn ₹500 for every successful referral</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Unlimited Potential</h3>
                <p className="text-sm text-gray-600">No limit on how many people you can refer</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Instant Tracking</h3>
                <p className="text-sm text-gray-600">Real-time tracking of your referrals</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Gift className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Quick Payouts</h3>
                <p className="text-sm text-gray-600">Fast and secure bonus payments</p>
              </div>
            </div>
          </div>
        </Card>

        {/* WhatsApp Support */}
        <Card className="bg-green-50 rounded-xl p-6">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Referral Support</h3>
            <p className="text-gray-600 mb-4">Need help with referrals? Our team is here to assist you!</p>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => openWhatsApp(`Hi Future Plus team! I need help with the referral program. My name is ${user.name || user.email} and my referral code is ${referralCode}.`)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Get Referral Help
            </Button>
            <div className="mt-3 flex items-center justify-center space-x-2 text-green-600">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{WHATSAPP_NUMBER}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}