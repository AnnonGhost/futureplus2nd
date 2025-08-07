'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Shield, 
  Settings, 
  Users, 
  Gift, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Crown,
  Key,
  Eye,
  EyeOff,
  Edit,
  Save,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'

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

interface User {
  id: string
  name: string
  email: string
  mobile?: string
  isActive: boolean
  createdAt: string
  wallet?: {
    balance: number
    bonus: number
  }
}

interface GiftDraw {
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

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [giftDraws, setGiftDraws] = useState<GiftDraw[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [editingPlan, setEditingPlan] = useState<string | null>(null)
  const [editingPlanData, setEditingPlanData] = useState<Partial<Plan>>({})

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchAdminData()
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: adminKey }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('adminAuth', 'true')
        setIsAuthenticated(true)
        fetchAdminData()
      } else {
        alert(data.error || 'Invalid admin key')
      }
    } catch (error) {
      console.error('Admin login error:', error)
      alert('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAdminData = async () => {
    try {
      // Fetch plans
      const plansResponse = await fetch('/api/plans')
      const plansData = await plansResponse.json()
      setPlans(plansData.plans || [])

      // Fetch users
      const usersResponse = await fetch('/api/admin/users')
      const usersData = await usersResponse.json()
      setUsers(usersData.users || [])

      // Fetch gift draws
      const giftsResponse = await fetch('/api/admin/gifts')
      const giftsData = await giftsResponse.json()
      setGiftDraws(giftsData.gifts || [])
    } catch (error) {
      console.error('Error fetching admin data:', error)
    }
  }

  const togglePlanStatus = async (planId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/admin/plans/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId, isActive }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage(`Plan ${isActive ? 'activated' : 'deactivated'} successfully`)
        setShowSuccess(true)
        fetchAdminData()
        
        setTimeout(() => setShowSuccess(false), 3000)
      } else {
        alert(data.error || 'Failed to update plan status')
      }
    } catch (error) {
      console.error('Plan toggle error:', error)
      alert('Network error. Please try again.')
    }
  }

  const startEditingPlan = (plan: Plan) => {
    setEditingPlan(plan.id)
    setEditingPlanData({ ...plan })
  }

  const savePlanChanges = async () => {
    if (!editingPlan || !editingPlanData) return

    try {
      const response = await fetch('/api/admin/plans/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId: editingPlan, ...editingPlanData }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage('Plan updated successfully')
        setShowSuccess(true)
        setEditingPlan(null)
        setEditingPlanData({})
        fetchAdminData()
        
        setTimeout(() => setShowSuccess(false), 3000)
      } else {
        alert(data.error || 'Failed to update plan')
      }
    } catch (error) {
      console.error('Plan update error:', error)
      alert('Network error. Please try again.')
    }
  }

  const cancelEditing = () => {
    setEditingPlan(null)
    setEditingPlanData({})
  }

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/admin/users/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, isActive }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage(`User ${isActive ? 'activated' : 'deactivated'} successfully`)
        setShowSuccess(true)
        fetchAdminData()
        
        setTimeout(() => setShowSuccess(false), 3000)
      } else {
        alert(data.error || 'Failed to update user status')
      }
    } catch (error) {
      console.error('User toggle error:', error)
      alert('Network error. Please try again.')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-gray-600 mt-2">Enter your admin key to continue</p>
          </div>

          <Card className="bg-white rounded-3xl shadow-xl p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-key">Admin Key</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="admin-key"
                    type={showKey ? 'text' : 'password'}
                    placeholder="Enter admin key"
                    className="pl-10 pr-10"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3"
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => router.push('/')} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <Crown className="w-6 h-6 text-yellow-400" />
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              localStorage.removeItem('adminAuth')
              setIsAuthenticated(false)
            }}
            className="text-gray-300 border-gray-600 hover:bg-gray-700"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Success Alert */}
      {showSuccess && (
        <div className="px-4 pt-4">
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Admin Dashboard */}
      <div className="px-4 py-6">
        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="plans" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Plans</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="gifts" className="flex items-center space-x-2">
              <Gift className="w-4 h-4" />
              <span>Gift Draws</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Manage Plans</h2>
              {plans.map((plan) => (
                <Card key={plan.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {editingPlan === plan.id ? (
                        <div className="space-y-3">
                          <Input
                            value={editingPlanData.name || ''}
                            onChange={(e) => setEditingPlanData({ ...editingPlanData, name: e.target.value })}
                            placeholder="Plan name"
                          />
                          <Input
                            value={editingPlanData.description || ''}
                            onChange={(e) => setEditingPlanData({ ...editingPlanData, description: e.target.value })}
                            placeholder="Description"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <Input
                              type="number"
                              value={editingPlanData.price || 0}
                              onChange={(e) => setEditingPlanData({ ...editingPlanData, price: parseFloat(e.target.value) })}
                              placeholder="Price"
                            />
                            <Input
                              type="number"
                              value={editingPlanData.duration || 0}
                              onChange={(e) => setEditingPlanData({ ...editingPlanData, duration: parseInt(e.target.value) })}
                              placeholder="Duration"
                            />
                            <Input
                              type="number"
                              value={editingPlanData.dailyReturn || 0}
                              onChange={(e) => setEditingPlanData({ ...editingPlanData, dailyReturn: parseFloat(e.target.value) })}
                              placeholder="Daily Return"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-bold text-gray-900">{plan.name}</h3>
                          <p className="text-sm text-gray-600">{plan.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="text-gray-500">₹{plan.price.toLocaleString()}</span>
                            <span className="text-gray-500">{plan.duration} days</span>
                            <span className="text-green-600 font-medium">₹{plan.dailyReturn.toLocaleString()}/day</span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      {editingPlan === plan.id ? (
                        <div className="flex items-center space-x-2">
                          <Button size="sm" onClick={savePlanChanges}>
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEditing}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => startEditingPlan(plan)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <Switch
                          checked={plan.isActive}
                          onCheckedChange={(checked) => togglePlanStatus(plan.id, checked)}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Manage Users</h2>
              {users.map((user) => (
                <Card key={user.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{user.name || 'Anonymous'}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.mobile && (
                        <p className="text-sm text-gray-500">{user.mobile}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span className="text-gray-500">
                          Balance: ₹{user.wallet?.balance.toLocaleString() || 0}
                        </span>
                        <span className="text-green-600">
                          Bonus: ₹{user.wallet?.bonus.toLocaleString() || 0}
                        </span>
                        <span className="text-gray-500">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <Switch
                          checked={user.isActive}
                          onCheckedChange={(checked) => toggleUserStatus(user.id, checked)}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="gifts">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Manage Gift Draws</h2>
              {giftDraws.map((gift) => (
                <Card key={gift.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{gift.name}</h3>
                      <p className="text-sm text-gray-600">{gift.type}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm">
                        <span className="text-green-600 font-medium">
                          Prize: ₹{gift.value.toLocaleString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          gift.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          gift.status === 'CLAIMED' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {gift.status}
                        </span>
                        <span className="text-gray-500">
                          Created: {new Date(gift.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {gift.winner && (
                        <div className="mt-2 p-2 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-800">
                            Winner: {gift.winner.name} ({gift.winner.email})
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      {gift.status === 'ACTIVE' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // TODO: Implement winner selection
                            alert('Winner selection feature coming soon')
                          }}
                        >
                          Select Winner
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}