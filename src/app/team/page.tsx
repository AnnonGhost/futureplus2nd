'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  Crown,
  Star,
  MessageCircle,
  Phone,
  UserPlus,
  Award,
  Target,
  Building,
  IndianRupee
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

interface TeamMember {
  id: string
  name: string
  email: string
  joinedAt: string
  totalEarnings: number
  activePlans: number
  referrals: number
}

interface TeamStats {
  totalMembers: number
  activeMembers: number
  totalEarnings: number
  totalReferrals: number
  topPerformer?: TeamMember
}

export default function TeamPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [teamStats, setTeamStats] = useState<TeamStats>({
    totalMembers: 0,
    activeMembers: 0,
    totalEarnings: 0,
    totalReferrals: 0
  })
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
        fetchTeamData(parsedUser.id)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      }
    }
    // Don't redirect - allow users to view team info without login
    fetchTeamData('demo') // Use demo data for non-logged in users
  }, [router])

  const fetchTeamData = async (userId: string) => {
    try {
      // For demo purposes, we'll create mock team data
      // In a real app, this would fetch from your API
      const mockTeamMembers: TeamMember[] = [
        {
          id: '1',
          name: 'Rajesh Kumar',
          email: 'rajesh@example.com',
          joinedAt: '2024-01-15',
          totalEarnings: 15000,
          activePlans: 2,
          referrals: 5
        },
        {
          id: '2',
          name: 'Priya Sharma',
          email: 'priya@example.com',
          joinedAt: '2024-02-01',
          totalEarnings: 12000,
          activePlans: 1,
          referrals: 3
        },
        {
          id: '3',
          name: 'Amit Patel',
          email: 'amit@example.com',
          joinedAt: '2024-02-15',
          totalEarnings: 8500,
          activePlans: 1,
          referrals: 2
        },
        {
          id: '4',
          name: 'Sneha Reddy',
          email: 'sneha@example.com',
          joinedAt: '2024-03-01',
          totalEarnings: 6500,
          activePlans: 1,
          referrals: 1
        }
      ]

      const mockTeamStats: TeamStats = {
        totalMembers: mockTeamMembers.length,
        activeMembers: mockTeamMembers.filter(m => m.activePlans > 0).length,
        totalEarnings: mockTeamMembers.reduce((sum, m) => sum + m.totalEarnings, 0),
        totalReferrals: mockTeamMembers.reduce((sum, m) => sum + m.referrals, 0),
        topPerformer: mockTeamMembers.reduce((top, current) => 
          current.totalEarnings > top.totalEarnings ? current : top
        )
      }

      setTeamMembers(mockTeamMembers)
      setTeamStats(mockTeamStats)
    } catch (error) {
      console.error('Error fetching team data:', error)
    }
  }

  const handleInviteToTeam = () => {
    if (!user) {
      setAlertMessage('Please login to invite team members')
      setAlertType('error')
      setShowAlert(true)
      setTimeout(() => router.push('/'), 1000)
      return
    }

    const message = `🌟 Join my team on Future Plus and start earning together! 🌟\n\nI'm building a successful team and I'd love for you to join me. With Future Plus, you can:\n\n✅ Earn ₹500-₹2000 daily\n✅ Work with a supportive team\n✅ Get expert guidance\n✅ Build your own network\n\nClick the link to join: https://futureplus.vercel.app\n\nLet's achieve financial freedom together! 💰\n\n- ${user.name || user.email}`
    
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
    
    setAlertMessage('Team invitation sent to WhatsApp!')
    setAlertType('success')
    setShowAlert(true)
  }

  const openWhatsApp = (message: string = '') => {
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank')
  }

  // Allow all users to view team page, but show login prompt for actions
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
            <h1 className="text-xl font-bold">My Team</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Team Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{teamStats.totalMembers}</p>
            <p className="text-sm text-gray-600">Team Members</p>
          </Card>
          
          <Card className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{teamStats.activeMembers}</p>
            <p className="text-sm text-gray-600">Active Members</p>
          </Card>
          
          <Card className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <IndianRupee className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{teamStats.totalEarnings.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Team Earnings</p>
          </Card>
          
          <Card className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <UserPlus className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{teamStats.totalReferrals}</p>
            <p className="text-sm text-gray-600">Total Referrals</p>
          </Card>
        </div>

        {/* Top Performer */}
        {teamStats.topPerformer && (
          <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-6 text-white shadow-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Crown className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Top Performer</h2>
                  <p className="text-2xl font-bold">{teamStats.topPerformer.name}</p>
                  <p className="text-yellow-100">₹{teamStats.topPerformer.totalEarnings.toLocaleString()} earned</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-5 h-5" />
                  <span className="text-sm">Team Leader</span>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
                  <span className="text-sm font-medium">
                    {teamStats.topPerformer.activePlans} Active Plans
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Invite to Team */}
        <Card className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Grow Your Team</h2>
            <p className="text-green-100 mb-6">Invite friends and family to join your team and earn together</p>
            <Button 
              className="bg-white text-green-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full text-lg"
              onClick={handleInviteToTeam}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Invite to Team
            </Button>
          </div>
        </Card>

        {/* Team Members */}
        <Card className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Team Members</h2>
            <Button variant="outline" size="sm" onClick={() => fetchTeamData(user.id)}>
              Refresh
            </Button>
          </div>
          
          {teamMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Build your team by inviting others</p>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleInviteToTeam}
              >
                Invite Your First Member
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.email}</p>
                      <p className="text-xs text-gray-500">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-green-50 rounded px-2 py-1">
                        <p className="text-green-600 font-medium">₹{member.totalEarnings.toLocaleString()}</p>
                        <p className="text-green-600 text-xs">Earned</p>
                      </div>
                      <div className="bg-blue-50 rounded px-2 py-1">
                        <p className="text-blue-600 font-medium">{member.activePlans}</p>
                        <p className="text-blue-600 text-xs">Plans</p>
                      </div>
                      <div className="bg-purple-50 rounded px-2 py-1">
                        <p className="text-purple-600 font-medium">{member.referrals}</p>
                        <p className="text-purple-600 text-xs">Referrals</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Team Benefits */}
        <Card className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Team Benefits</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Collective Growth</h3>
                <p className="text-sm text-gray-600">Grow together and achieve financial goals as a team</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Team Bonuses</h3>
                <p className="text-sm text-gray-600">Earn additional bonuses for team performance</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Shared Knowledge</h3>
                <p className="text-sm text-gray-600">Learn from successful team members</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Network Building</h3>
                <p className="text-sm text-gray-600">Build a strong network for long-term success</p>
              </div>
            </div>
          </div>
        </Card>

        {/* WhatsApp Support */}
        <Card className="bg-green-50 rounded-xl p-6">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Support</h3>
            <p className="text-gray-600 mb-4">Need help building your team? Our experts are here to guide you!</p>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => openWhatsApp(`Hi Future Plus team! I need help building my team. My name is ${user.name || user.email} and I want to grow my network.`)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Get Team Building Help
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