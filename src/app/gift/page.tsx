'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Gift, 
  Star, 
  Crown,
  CheckCircle,
  MessageCircle,
  Phone,
  Calendar,
  Trophy,
  Users,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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

interface Gift {
  id: string
  name: string
  type: string
  value: number
  status: string
  winner?: {
    name: string
    email: string
  }
  createdAt: string
}

export default function GiftPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [gifts, setGifts] = useState<Gift[]>([])
  const [userParticipations, setUserParticipations] = useState<any[]>([])
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
        fetchGifts()
        fetchUserParticipations(parsedUser.id)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      }
    }
    // Don't redirect - allow users to view gifts without login
    fetchGifts()
  }, [router])

  const fetchGifts = async () => {
    try {
      const response = await fetch('/api/gift/active')
      const data = await response.json()
      if (response.ok) {
        setGifts(data.gifts || [])
      }
    } catch (error) {
      console.error('Error fetching gifts:', error)
    }
  }

  const fetchUserParticipations = async (userId: string) => {
    try {
      const response = await fetch(`/api/gift/participations?userId=${userId}`)
      const data = await response.json()
      if (response.ok) {
        setUserParticipations(data.participations || [])
      }
    } catch (error) {
      console.error('Error fetching user participations:', error)
    }
  }

  const handleParticipate = async (giftId: string) => {
    if (!user) {
      setAlertMessage('Please login to participate in gifts')
      setAlertType('error')
      setShowAlert(true)
      setTimeout(() => router.push('/'), 1000)
      return
    }

    try {
      const response = await fetch('/api/gift/participate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ giftId, userId: user.id }),
      })

      const data = await response.json()

      if (response.ok) {
        setAlertMessage('Participation successful! Good luck!')
        setAlertType('success')
        setShowAlert(true)
        fetchUserParticipations(user.id)
      } else {
        setAlertMessage(data.error || 'Failed to participate')
        setAlertType('error')
        setShowAlert(true)
      }
    } catch (error) {
      console.error('Participation error:', error)
      setAlertMessage('Network error. Please try again.')
      setAlertType('error')
      setShowAlert(true)
    }
  }

  const handleClaimGift = async (giftId: string) => {
    if (!user) {
      setAlertMessage('Please login to claim gifts')
      setAlertType('error')
      setShowAlert(true)
      setTimeout(() => router.push('/'), 1000)
      return
    }

    const message = `Hi Future Plus team! I want to claim my gift.\n\nDetails:\nName: ${user.name || user.email}\nGift ID: ${giftId}\n\nPlease help me claim my gift.`
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank')
    
    setAlertMessage('Claim request sent to WhatsApp. Our team will assist you shortly!')
    setAlertType('success')
    setShowAlert(true)
  }

  const openWhatsApp = (message: string = '') => {
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank')
  }

  const getGiftTypeColor = (type: string) => {
    switch (type) {
      case 'LUCKY_DRAW':
        return 'bg-purple-100 text-purple-800'
      case 'BONUS':
        return 'bg-green-100 text-green-800'
      case 'CASHBACK':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getGiftTypeIcon = (type: string) => {
    switch (type) {
      case 'LUCKY_DRAW':
        return <Star className="w-5 h-5" />
      case 'BONUS':
        return <Gift className="w-5 h-5" />
      case 'CASHBACK':
        return <Trophy className="w-5 h-5" />
      default:
        return <Gift className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-100'
      case 'CLAIMED':
        return 'text-blue-600 bg-blue-100'
      case 'EXPIRED':
        return 'text-red-600 bg-red-100'
      case 'CANCELLED':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const hasParticipated = (giftId: string) => {
    return userParticipations.some(p => p.giftId === giftId)
  }

  // Allow all users to view gift page, but some actions require login
  const canParticipate = !!user;

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
            <Gift className="w-6 h-6" />
            <h1 className="text-xl font-bold">Gift & Rewards</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Gift className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{gifts.length}</p>
            <p className="text-sm text-gray-600">Active Gifts</p>
          </Card>
          
          <Card className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{userParticipations.length}</p>
            <p className="text-sm text-gray-600">Participated</p>
          </Card>
          
          <Card className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {userParticipations.filter(p => p.status === 'WON').length}
            </p>
            <p className="text-sm text-gray-600">Won</p>
          </Card>
          
          <Card className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">24/7</p>
            <p className="text-sm text-gray-600">Support</p>
          </Card>
        </div>

        {/* Active Gifts */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Gifts & Draws</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gifts.filter(gift => gift.status === 'ACTIVE').map((gift) => (
              <Card key={gift.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${getGiftTypeColor(gift.type)}`}>
                    {getGiftTypeIcon(gift.type)}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">{gift.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getGiftTypeColor(gift.type)}`}>
                    {gift.type.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-green-600 mb-1">₹{gift.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Prize Value</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(gift.status)}`}>
                      {gift.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span className="text-gray-900">
                      {new Date(gift.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {gift.winner && (
                  <div className="bg-green-50 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-green-800 text-center">
                      Winner: {gift.winner.name}
                    </p>
                  </div>
                )}
                
                <div className="space-y-2">
                  {hasParticipated(gift.id) ? (
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleClaimGift(gift.id)}
                    >
                      Claim Gift
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleParticipate(gift.id)}
                    >
                      Participate Now
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => openWhatsApp(`Hi Future Plus team! I have questions about the "${gift.name}" gift. Can you provide more details?`)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ask Question
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* My Participations */}
        <Card className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">My Participations</h2>
            <Button variant="outline" size="sm" onClick={() => fetchUserParticipations(user.id)}>
              Refresh
            </Button>
          </div>
          
          {userParticipations.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">You haven't participated in any gifts yet</p>
              <Button 
                className="mt-4 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  const firstGift = gifts.find(g => g.status === 'ACTIVE')
                  if (firstGift) {
                    handleParticipate(firstGift.id)
                  }
                }}
              >
                Participate in Your First Gift
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {userParticipations.map((participation) => (
                <div key={participation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <Gift className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{participation.gift?.name || 'Unknown Gift'}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(participation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      participation.status === 'WON' ? 'bg-green-100 text-green-800' :
                      participation.status === 'PARTICIPATED' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {participation.status}
                    </span>
                    {participation.status === 'WON' && (
                      <Button 
                        size="sm" 
                        className="ml-2 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleClaimGift(participation.giftId)}
                      >
                        Claim
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* How It Works */}
        <Card className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Choose a Gift</h3>
              <p className="text-sm text-gray-600">Select from our active gift draws and rewards</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Participate</h3>
              <p className="text-sm text-gray-600">Click participate to enter the draw or claim the reward</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Win & Claim</h3>
              <p className="text-sm text-gray-600">If selected, claim your prize through WhatsApp</p>
            </div>
          </div>
        </Card>

        {/* WhatsApp Support */}
        <Card className="bg-green-50 rounded-xl p-6">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gift Support</h3>
            <p className="text-gray-600 mb-4">Have questions about our gifts? Our team is here to help!</p>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => openWhatsApp(`Hi Future Plus team! I need help with the gift program. My name is ${user.name || user.email}.`)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat on WhatsApp
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