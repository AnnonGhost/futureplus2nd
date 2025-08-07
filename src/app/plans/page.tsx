'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  TrendingUp, 
  Clock, 
  Star, 
  Crown,
  CheckCircle,
  MessageCircle,
  Phone,
  IndianRupee,
  Calendar,
  Percent
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

interface Plan {
  id: string
  name: string
  description: string
  price: number
  duration: number
  dailyReturn: number
  type: string
  isActive: boolean
}

export default function PlansPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
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
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      }
    }
    // Don't redirect - allow users to view plans without login
    fetchPlans()
  }, [router])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans')
      const data = await response.json()
      if (response.ok) {
        setPlans(data.plans || [])
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    }
  }

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan)
  }

  const handleActivatePlan = () => {
    if (!selectedPlan) return
    
    if (!user) {
      setAlertMessage('Please login to activate plans')
      setAlertType('error')
      setShowAlert(true)
      setTimeout(() => router.push('/'), 1000)
      return
    }

    const message = `Hi Future Plus team! I want to activate the following plan:\n\nPlan: ${selectedPlan.name}\nPrice: ₹${selectedPlan.price.toLocaleString()}\nDuration: ${selectedPlan.duration} days\nDaily Return: ₹${selectedPlan.dailyReturn.toLocaleString()}\n\nMy Details:\nName: ${user.name || user.email}\nEmail: ${user.email}\nCurrent Balance: ₹${user.wallet?.balance.toLocaleString() || 0}\n\nPlease help me activate this plan.`
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank')
    
    setSelectedPlan(null)
    setAlertMessage('Plan activation request sent to WhatsApp. Our team will assist you shortly!')
    setAlertType('success')
    setShowAlert(true)
  }

  const openWhatsApp = (message: string = '') => {
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank')
  }

  const getPlanTypeColor = (type: string) => {
    switch (type) {
      case 'LUCKY_DRAW':
        return 'bg-purple-100 text-purple-800'
      case 'PASSION_INCOME':
        return 'bg-blue-100 text-blue-800'
      case 'PREMIUM':
        return 'bg-green-100 text-green-800'
      case 'BIG_BONANZA':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlanTypeIcon = (type: string) => {
    switch (type) {
      case 'LUCKY_DRAW':
        return <Star className="w-5 h-5" />
      case 'PASSION_INCOME':
        return <TrendingUp className="w-5 h-5" />
      case 'PREMIUM':
        return <Crown className="w-5 h-5" />
      case 'BIG_BONANZA':
        return <Crown className="w-5 h-5" />
      default:
        return <TrendingUp className="w-5 h-5" />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

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
            <TrendingUp className="w-6 h-6" />
            <h1 className="text-xl font-bold">Investment Plans</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Current Balance */}
        <Card className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Current Balance</p>
              <p className="text-3xl font-bold">₹{user.wallet?.balance.toLocaleString() || 0}</p>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <IndianRupee className="w-8 h-8" />
            </div>
          </div>
        </Card>

        {/* Plans Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {plans.filter(plan => plan.isActive).map((plan) => (
              <Card 
                key={plan.id} 
                className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer border-2 ${
                  selectedPlan?.id === plan.id ? 'border-green-500' : 'border-transparent'
                }`}
                onClick={() => handleSelectPlan(plan)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPlanTypeColor(plan.type)}`}>
                      {getPlanTypeIcon(plan.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{plan.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPlanTypeColor(plan.type)}`}>
                        {plan.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">₹{plan.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">one-time</p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Duration</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">{plan.duration} days</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Percent className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Daily Return</span>
                    </div>
                    <p className="text-lg font-bold text-green-600">₹{plan.dailyReturn.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Return</span>
                    <span className="font-bold text-gray-900">₹{(plan.dailyReturn * plan.duration).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-600">Profit</span>
                    <span className="font-bold text-green-600">₹{(plan.dailyReturn * plan.duration - plan.price).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                  <Button 
                    size="sm"
                    className={selectedPlan?.id === plan.id ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelectPlan(plan)
                    }}
                  >
                    {selectedPlan?.id === plan.id ? 'Selected' : 'Select'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Plan Summary */}
        {selectedPlan && (
          <Card className="bg-white rounded-xl p-6 shadow-sm mb-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Selected Plan Summary</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedPlan(null)}
              >
                Change
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{selectedPlan.name}</h4>
                <p className="text-gray-600 text-sm mb-3">{selectedPlan.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan Price:</span>
                    <span className="font-semibold">₹{selectedPlan.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{selectedPlan.duration} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Return:</span>
                    <span className="font-semibold text-green-600">₹{selectedPlan.dailyReturn.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Return:</span>
                    <span className="font-semibold">₹{(selectedPlan.dailyReturn * selectedPlan.duration).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3">Activation Details</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-green-700">Your Current Balance:</span>
                    <span className="font-semibold text-green-900">₹{user.wallet?.balance.toLocaleString() || 0}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-green-700">Amount Needed:</span>
                    <span className="font-semibold text-green-900">₹{selectedPlan.price.toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t border-green-200 pt-2">
                    <div className="flex justify-between">
                      <span className="text-green-700 font-medium">Balance After:</span>
                      <span className="font-bold text-green-900">
                        ₹{Math.max(0, (user.wallet?.balance || 0) - selectedPlan.price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {(user.wallet?.balance || 0) < selectedPlan.price && (
                    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-2">
                      <p className="text-sm text-yellow-800">
                        Insufficient balance. Please recharge your wallet first.
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                    onClick={handleActivatePlan}
                    disabled={(user.wallet?.balance || 0) < selectedPlan.price}
                  >
                    Activate Plan via WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* WhatsApp Support */}
        <Card className="bg-green-50 rounded-xl p-6">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help Choosing?</h3>
            <p className="text-gray-600 mb-4">Our experts can help you select the best plan for your goals</p>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => openWhatsApp(`Hi Future Plus team! I need help choosing the right investment plan. My name is ${user.name || user.email} and my current balance is ₹${user.wallet?.balance.toLocaleString() || 0}.`)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Get Expert Advice
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