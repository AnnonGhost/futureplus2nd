'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Globe, 
  Shield, 
  TrendingUp, 
  Users,
  Award,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Star,
  Heart,
  Target,
  MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function AboutPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

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
  }, [router])

  const openWhatsApp = (message: string = '') => {
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank')
  }

  const features = [
    {
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      title: "Daily Earnings",
      description: "Earn ₹500-₹2000 daily with our proven microtask platform"
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "Secure Platform",
      description: "Your data and earnings are protected with advanced security"
    },
    {
      icon: <Users className="w-6 h-6 text-purple-600" />,
      title: "Community Driven",
      description: "Join thousands of satisfied users across India"
    },
    {
      icon: <Award className="w-6 h-6 text-orange-600" />,
      title: "Rewards Program",
      description: "Get exciting bonuses and rewards for your activity"
    }
  ]

  const stats = [
    { label: "Active Users", value: "10,000+", icon: <Users className="w-5 h-5" /> },
    { label: "Daily Payouts", value: "₹50L+", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Success Rate", value: "98%", icon: <CheckCircle className="w-5 h-5" /> },
    { label: "Cities Covered", value: "500+", icon: <MapPin className="w-5 h-5" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-lg">
        <div className="flex items-center space-x-3">
          <button onClick={() => router.push('/')} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">About Future Plus</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Future Plus</h2>
          <p className="text-gray-600">India's Most Trusted Microtask Platform</p>
        </div>

        <Card className="bg-gradient-to-br from-green-500 to-green-700 rounded-3xl p-6 text-white shadow-xl mb-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-3">Our Mission</h3>
            <p className="text-green-100 leading-relaxed">
              To empower every Indian with the opportunity to earn a sustainable income through simple, 
              accessible microtasks. We believe in financial inclusion and creating opportunities for 
              everyone to achieve their financial goals.
            </p>
          </div>
        </Card>

        {/* Stats */}
        <div className="px-4 pb-6">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="px-4 pb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Why Choose Future Plus?</h2>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="px-4 pb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="space-y-3">
            <Card className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Sign Up</p>
                  <p className="text-sm text-gray-600">Create your account in minutes with just your email and mobile number</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Choose Your Plan</p>
                  <p className="text-sm text-gray-600">Select from our range of investment plans that suit your budget</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Start Earning</p>
                  <p className="text-sm text-gray-600">Watch your earnings grow daily with our guaranteed returns</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Withdraw Anytime</p>
                  <p className="text-sm text-gray-600">Easy withdrawals to your UPI account with no hidden charges</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Values */}
        <div className="px-4 pb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Our Values</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-blue-50 rounded-xl p-4">
              <div className="text-center">
                <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900 mb-1">Trust</h3>
                <p className="text-xs text-blue-700">Building lasting relationships through transparency</p>
              </div>
            </Card>
            
            <Card className="bg-green-50 rounded-xl p-4">
              <div className="text-center">
                <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-900 mb-1">Innovation</h3>
                <p className="text-xs text-green-700">Constantly improving our platform</p>
              </div>
            </Card>
            
            <Card className="bg-purple-50 rounded-xl p-4">
              <div className="text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900 mb-1">Community</h3>
                <p className="text-xs text-purple-700">Supporting each other's growth</p>
              </div>
            </Card>
            
            <Card className="bg-orange-50 rounded-xl p-4">
              <div className="text-center">
                <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold text-orange-900 mb-1">Excellence</h3>
                <p className="text-xs text-orange-700">Delivering the best experience</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Contact */}
        <div className="px-4 pb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Get in Touch</h2>
          <Card className="bg-white rounded-xl p-4 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Call Us</p>
                  <p className="text-sm text-gray-600">{WHATSAPP_NUMBER}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email Us</p>
                  <p className="text-sm text-gray-600">support@futureplus.in</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Visit Us</p>
                  <p className="text-sm text-gray-600">Mumbai, Maharashtra, India</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* WhatsApp CTA */}
        <div className="px-4 pb-6">
          <div className="bg-green-600 rounded-2xl p-6 text-center text-white">
            <h3 className="text-lg font-bold mb-2">Need Help?</h3>
            <p className="text-green-100 text-sm mb-4">Our support team is available 24/7</p>
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-full"
              onClick={() => openWhatsApp('Hi Future Plus team! I have some questions about your platform.')}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}