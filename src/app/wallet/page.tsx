'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Wallet, 
  TrendingUp, 
  ArrowDown, 
  ArrowUp,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  MessageCircle,
  IndianRupee,
  CreditCard,
  Smartphone,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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

interface Transaction {
  id: string
  type: string
  amount: number
  status: string
  reference?: string
  upiId?: string
  bonus: number
  createdAt: string
}

export default function WalletPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showRecharge, setShowRecharge] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [rechargeData, setRechargeData] = useState({ amount: '', upiId: '', upiNumber: '' })
  const [withdrawData, setWithdrawData] = useState({ amount: '', upiId: '' })
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
        fetchTransactions(parsedUser.id)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      }
    }
    // Don't redirect - show login modal instead
  }, [router])

  const fetchTransactions = async (userId: string) => {
    try {
      const response = await fetch(`/api/wallet/transactions?userId=${userId}`)
      const data = await response.json()
      if (response.ok) {
        setTransactions(data.transactions || [])
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!rechargeData.amount || !rechargeData.upiId || !rechargeData.upiNumber) {
      setAlertMessage('Please fill all fields')
      setAlertType('error')
      setShowAlert(true)
      return
    }

    const amount = parseFloat(rechargeData.amount)
    if (amount <= 0) {
      setAlertMessage('Amount must be greater than 0')
      setAlertType('error')
      setShowAlert(true)
      return
    }

    // Open WhatsApp with recharge details
    const message = `Hi Future Plus team! I want to recharge my wallet.\n\nDetails:\nName: ${user?.name || user?.email}\nAmount: ₹${amount}\nUPI ID: ${rechargeData.upiId}\nUPI Number: ${rechargeData.upiNumber}\n\nPlease help me complete the payment process.`
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank')
    
    setShowRecharge(false)
    setRechargeData({ amount: '', upiId: '', upiNumber: '' })
    setAlertMessage('Recharge request sent to WhatsApp. Our team will assist you shortly!')
    setAlertType('success')
    setShowAlert(true)
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!withdrawData.amount || !withdrawData.upiId) {
      setAlertMessage('Please fill all fields')
      setAlertType('error')
      setShowAlert(true)
      return
    }

    const amount = parseFloat(withdrawData.amount)
    if (amount <= 0) {
      setAlertMessage('Amount must be greater than 0')
      setAlertType('error')
      setShowAlert(true)
      return
    }

    if (user?.wallet && amount > user.wallet.balance) {
      setAlertMessage('Insufficient balance')
      setAlertType('error')
      setShowAlert(true)
      return
    }

    // Open WhatsApp with withdrawal details
    const message = `Hi Future Plus team! I want to withdraw from my wallet.\n\nDetails:\nName: ${user?.name || user?.email}\nAmount: ₹${amount}\nUPI ID: ${withdrawData.upiId}\n\nPlease process my withdrawal request.`
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank')
    
    setShowWithdraw(false)
    setWithdrawData({ amount: '', upiId: '' })
    setAlertMessage('Withdrawal request sent to WhatsApp. Our team will process it shortly!')
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
      case 'FAILED':
        return 'text-red-600 bg-red-100'
      case 'CANCELLED':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />
      case 'FAILED':
        return <XCircle className="w-4 h-4" />
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'RECHARGE':
        return <ArrowDown className="w-4 h-4 text-green-600" />
      case 'WITHDRAWAL':
        return <ArrowUp className="w-4 h-4 text-red-600" />
      case 'BONUS':
        return <TrendingUp className="w-4 h-4 text-blue-600" />
      case 'REFERRAL':
        return <TrendingUp className="w-4 h-4 text-purple-600" />
      case 'PLAN_RETURN':
        return <TrendingUp className="w-4 h-4 text-orange-600" />
      default:
        return <Wallet className="w-4 h-4 text-gray-600" />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Header */}
        <header className="bg-green-600 text-white p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <button onClick={() => router.push('/')} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-2">
              <Wallet className="w-6 h-6" />
              <h1 className="text-xl font-bold">My Wallet</h1>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-600 mb-6">Please login to access your wallet and manage your funds.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowDown className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Recharge Wallet</h3>
                <p className="text-gray-600 text-sm mb-4">Add funds to your wallet</p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    setAlertMessage('Please login to recharge your wallet')
                    setAlertType('error')
                    setShowAlert(true)
                    setTimeout(() => router.push('/'), 1000)
                  }}
                >
                  Login to Recharge
                </Button>
              </div>
            </Card>

            <Card className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowUp className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Withdraw Funds</h3>
                <p className="text-gray-600 text-sm mb-4">Transfer to your bank account</p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    setAlertMessage('Please login to withdraw funds')
                    setAlertType('error')
                    setShowAlert(true)
                    setTimeout(() => router.push('/'), 1000)
                  }}
                >
                  Login to Withdraw
                </Button>
              </div>
            </Card>
          </div>

          <Card className="bg-green-50 rounded-xl p-6">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">New to Future Plus?</h3>
              <p className="text-gray-600 mb-4">Create an account and start earning today!</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => router.push('/')}
                >
                  Sign Up Now
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => openWhatsApp('Hi Future Plus team! I need help creating an account.')}
                >
                  Get Help
                </Button>
              </div>
            </div>
          </Card>
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
            <Wallet className="w-6 h-6" />
            <h1 className="text-xl font-bold">My Wallet</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Wallet Balance Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-green-100 text-sm">Main Balance</p>
                  <p className="text-2xl font-bold">₹{user.wallet?.balance.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-green-100 text-sm">
              <IndianRupee className="w-4 h-4" />
              <span>Available for withdrawal</span>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Bonus Balance</p>
                  <p className="text-2xl font-bold">₹{user.wallet?.bonus.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-blue-100 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Rewards and bonuses</span>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowDown className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Recharge Wallet</h3>
              <p className="text-gray-600 text-sm mb-4">Add funds to your wallet</p>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setShowRecharge(true)}
              >
                Recharge Now
              </Button>
            </div>
          </Card>

          <Card className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowUp className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Withdraw Funds</h3>
              <p className="text-gray-600 text-sm mb-4">Transfer to your bank account</p>
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setShowWithdraw(true)}
              >
                Withdraw Now
              </Button>
            </div>
          </Card>
        </div>

        {/* Transactions */}
        <Card className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
            <Button variant="outline" size="sm" onClick={() => fetchTransactions(user.id)}>
              Refresh
            </Button>
          </div>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      {getTransactionTypeIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{transaction.type.toLowerCase()}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'RECHARGE' || transaction.type === 'BONUS' || transaction.type === 'REFERRAL' || transaction.type === 'PLAN_RETURN'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'RECHARGE' || transaction.type === 'BONUS' || transaction.type === 'REFERRAL' || transaction.type === 'PLAN_RETURN' ? '+' : '-'}
                      ₹{transaction.amount.toLocaleString()}
                    </p>
                    <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span>{transaction.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* WhatsApp Support */}
        <Card className="bg-green-50 rounded-xl p-6 mt-6">
          <div className="text-center">
            <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">Our support team is available 24/7 to assist you</p>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => openWhatsApp(`Hi Future Plus team! I need help with my wallet. My name is ${user.name || user.email}.`)}
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

      {/* Recharge Modal */}
      {showRecharge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recharge Wallet</h2>
              <button onClick={() => setShowRecharge(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleRecharge} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={rechargeData.amount}
                  onChange={(e) => setRechargeData({ ...rechargeData, amount: e.target.value })}
                  min="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="upi-id">UPI ID</Label>
                <Input
                  id="upi-id"
                  type="text"
                  placeholder="your@upi"
                  value={rechargeData.upiId}
                  onChange={(e) => setRechargeData({ ...rechargeData, upiId: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="upi-number">UPI Number</Label>
                <Input
                  id="upi-number"
                  type="tel"
                  placeholder="Mobile number linked to UPI"
                  value={rechargeData.upiNumber}
                  onChange={(e) => setRechargeData({ ...rechargeData, upiNumber: e.target.value })}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
              >
                Send Recharge Request
              </Button>
            </form>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Clicking "Send Recharge Request" will open WhatsApp with your details. Our team will guide you through the payment process.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Withdraw Funds</h2>
              <button onClick={() => setShowWithdraw(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount (₹)</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawData.amount}
                  onChange={(e) => setWithdrawData({ ...withdrawData, amount: e.target.value })}
                  min="1"
                  max={user.wallet?.balance || 0}
                  required
                />
                <p className="text-sm text-gray-600">
                  Available balance: ₹{user.wallet?.balance.toLocaleString() || 0}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="withdraw-upi">UPI ID</Label>
                <Input
                  id="withdraw-upi"
                  type="text"
                  placeholder="your@upi"
                  value={withdrawData.upiId}
                  onChange={(e) => setWithdrawData({ ...withdrawData, upiId: e.target.value })}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
              >
                Send Withdrawal Request
              </Button>
            </form>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Clicking "Send Withdrawal Request" will open WhatsApp with your details. Our team will process your withdrawal.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}