"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    ArrowLeft,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Plane,
    Hotel,
    UtensilsCrossed,
    Ticket,
    Car,
    AlertTriangle,
    PieChart,
    BarChart3,
    Calendar,
    Plus,
    Trash2
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import {
    PieChart as RechartsPie,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts"

interface Trip {
    id: string
    name: string
    totalBudget: number
    startDate: string
    endDate: string
}

interface Expense {
    id?: string
    category: string
    amount: number
    description?: string
    date?: string
}

const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#a855f7', '#ec4899', '#eab308']

const categoryIcons: Record<string, React.ReactNode> = {
    transport: <Plane className="h-5 w-5" />,
    accommodation: <Hotel className="h-5 w-5" />,
    food: <UtensilsCrossed className="h-5 w-5" />,
    activities: <Ticket className="h-5 w-5" />,
    other: <Car className="h-5 w-5" />,
}

const categoryLabels: Record<string, string> = {
    transport: "Transport",
    accommodation: "Accommodation",
    food: "Food & Dining",
    activities: "Activities",
    other: "Other",
}

export default function BudgetPage() {
    const params = useParams()
    const tripId = params.id as string
    const [trip, setTrip] = useState<Trip | null>(null)
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [isLoading, setIsLoading] = useState(true)
    
    // Add expense dialog state
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
    const [newExpense, setNewExpense] = useState<{category: string, amount: string, description: string, date: string}>({
        category: "",
        amount: "",
        description: "",
        date: ""
    })

    useEffect(() => {
        fetchTripData()
    }, [tripId])

    const fetchTripData = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/trips/${tripId}`)
            const data = await res.json()
            if (data.trip) {
                setTrip(data.trip)
                setExpenses(data.trip.expenses || [])
            }
        } catch (error) {
            console.error('Error fetching trip:', error)
        }
        setIsLoading(false)
    }

    const handleAddExpense = () => {
        if (!newExpense.category || !newExpense.amount) {
            toast.error("Please fill in category and amount")
            return
        }

        const expense: Expense = {
            id: `exp-${Date.now()}`,
            category: newExpense.category,
            amount: parseFloat(newExpense.amount),
            description: newExpense.description,
            date: newExpense.date || new Date().toISOString().split('T')[0]
        }

        setExpenses(prev => [...prev, expense])
        setNewExpense({ category: "", amount: "", description: "", date: "" })
        setIsAddExpenseOpen(false)
        toast.success("Expense added successfully!")
    }

    const handleDeleteExpense = (expenseId: string) => {
        setExpenses(prev => prev.filter(e => e.id !== expenseId))
        toast.success("Expense deleted")
    }

    // Calculate totals and breakdowns
    const expensesByCategory = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount
        return acc
    }, {} as Record<string, number>)

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const budget = trip?.totalBudget || 3500
    const remaining = budget - totalSpent
    const percentUsed = (totalSpent / budget) * 100

    // Prepare chart data
    const pieData = Object.entries(expensesByCategory).map(([category, amount]) => ({
        name: categoryLabels[category] || category,
        value: amount,
    }))

    // Calculate daily spending with per-day budget alerts
    const startDate = trip?.startDate ? new Date(trip.startDate) : new Date()
    const endDate = trip?.endDate ? new Date(trip.endDate) : new Date()
    const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const avgPerDay = totalSpent / (tripDays || 1)
    const dailyBudgetTarget = budget / tripDays

    // Generate daily data with actual expenses if available
    const dailyData = Array.from({ length: Math.min(tripDays, 7) }, (_, i) => {
        const dayDate = new Date(startDate)
        dayDate.setDate(dayDate.getDate() + i)
        const dayExpenses = expenses.filter(exp => {
            if (!exp.date) return false
            const expDate = new Date(exp.date)
            return expDate.toDateString() === dayDate.toDateString()
        })
        const daySpent = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0) || Math.floor(avgPerDay * (0.7 + Math.random() * 0.6))
        
        return {
            day: `Day ${i + 1}`,
            spent: daySpent,
            budget: Math.floor(dailyBudgetTarget),
            overBudget: daySpent > dailyBudgetTarget
        }
    })

    // Find days over budget for alerts
    const daysOverBudget = dailyData.filter(d => d.overBudget)

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-6xl">
                <div className="animate-pulse space-y-8">
                    <div className="h-8 bg-muted rounded w-1/4" />
                    <div className="h-64 bg-muted rounded" />
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="h-96 bg-muted rounded" />
                        <div className="h-96 bg-muted rounded" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" asChild className="hover:bg-blue-50 hover:text-blue-600">
                    <Link href={`/trips/${tripId}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Trip
                    </Link>
                </Button>
                
                <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/30">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Expense
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-blue-500" />
                                Add New Expense
                            </DialogTitle>
                            <DialogDescription>
                                Record a new expense for this trip
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={newExpense.category} onValueChange={(v) => setNewExpense(prev => ({...prev, category: v}))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="transport">Transport</SelectItem>
                                        <SelectItem value="accommodation">Accommodation</SelectItem>
                                        <SelectItem value="food">Food & Dining</SelectItem>
                                        <SelectItem value="activities">Activities</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Amount ($)</Label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={newExpense.amount}
                                    onChange={(e) => setNewExpense(prev => ({...prev, amount: e.target.value}))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description (optional)</Label>
                                <Input
                                    placeholder="e.g., Flight to Paris"
                                    value={newExpense.description}
                                    onChange={(e) => setNewExpense(prev => ({...prev, description: e.target.value}))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Input
                                    type="date"
                                    value={newExpense.date}
                                    onChange={(e) => setNewExpense(prev => ({...prev, date: e.target.value}))}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddExpense} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Expense
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent">Budget & Cost Breakdown</h1>
                <p className="text-gray-500">{trip?.name || "Trip Budget"}</p>
            </div>

            {/* Per-Day Budget Alerts */}
            {daysOverBudget.length > 0 && (
                <Card className="mb-8 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-amber-700">
                            <AlertTriangle className="h-5 w-5" />
                            Daily Budget Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-amber-600 mb-2">
                            {daysOverBudget.length} day(s) exceeded the daily budget of ${dailyBudgetTarget.toFixed(0)}:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {daysOverBudget.map(d => (
                                <span key={d.day} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                    {d.day}: ${d.spent} spent
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Summary Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-xl shadow-blue-500/30">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-white/80">Total Budget</CardDescription>
                        <CardTitle className="text-3xl flex items-center gap-2">
                            <DollarSign className="h-6 w-6" />
                            {budget.toLocaleString()}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card className="border-blue-100/50 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-gray-500">Total Spent</CardDescription>
                        <CardTitle className="text-3xl flex items-center gap-2 text-cyan-500">
                            <TrendingUp className="h-6 w-6" />
                            ${totalSpent.toLocaleString()}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card className="border-blue-100/50 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-gray-500">Remaining</CardDescription>
                        <CardTitle className={`text-3xl flex items-center gap-2 ${remaining >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {remaining >= 0 ? <TrendingDown className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                            ${Math.abs(remaining).toLocaleString()}
                        </CardTitle>
                    </CardHeader>
                </Card>

                <Card className="border-blue-100/50 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-gray-500">Avg. per Day</CardDescription>
                        <CardTitle className="text-3xl flex items-center gap-2">
                            <Calendar className="h-6 w-6 text-blue-500" />
                            ${avgPerDay.toFixed(0)}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Budget Progress */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Budget Usage</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>{percentUsed.toFixed(1)}% used</span>
                            <span>${totalSpent.toLocaleString()} of ${budget.toLocaleString()}</span>
                        </div>
                        <Progress
                            value={Math.min(percentUsed, 100)}
                            className={`h-4 ${percentUsed > 100 ? '[&>div]:bg-red-500' : percentUsed > 80 ? '[&>div]:bg-yellow-500' : ''}`}
                        />
                        {percentUsed > 80 && percentUsed <= 100 && (
                            <p className="text-sm text-yellow-600 flex items-center gap-1 mt-2">
                                <AlertTriangle className="h-4 w-4" />
                                You've used over 80% of your budget
                            </p>
                        )}
                        {percentUsed > 100 && (
                            <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                                <AlertTriangle className="h-4 w-4" />
                                You've exceeded your budget by ${(totalSpent - budget).toLocaleString()}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Expense List */}
            <Card className="mb-8 border-blue-100/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-blue-500" />
                        All Expenses
                    </CardTitle>
                    <CardDescription>Individual expenses for this trip</CardDescription>
                </CardHeader>
                <CardContent>
                    {expenses.length > 0 ? (
                        <div className="space-y-3">
                            {expenses.map((expense, index) => (
                                <div key={expense.id || index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border border-blue-100 hover:border-blue-200 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-white shadow-sm" style={{ color: COLORS[index % COLORS.length] }}>
                                            {categoryIcons[expense.category] || <DollarSign className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {expense.description || categoryLabels[expense.category] || expense.category}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {categoryLabels[expense.category] || expense.category}
                                                {expense.date && ` • ${new Date(expense.date).toLocaleDateString()}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-emerald-600">${expense.amount.toLocaleString()}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                            onClick={() => expense.id && handleDeleteExpense(expense.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-30" />
                            <p>No expenses recorded yet</p>
                            <Button 
                                variant="link" 
                                className="text-blue-500 mt-2"
                                onClick={() => setIsAddExpenseOpen(true)}
                            >
                                Add your first expense
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5 text-primary" />
                            Expense Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPie>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {pieData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `$${value}`} />
                                </RechartsPie>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            Daily Spending
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dailyData}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `$${value}`} />
                                    <Legend />
                                    <Bar dataKey="spent" name="Spent" fill="#f97316" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="budget" name="Daily Budget" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Category Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                    <CardDescription>Detailed view of expenses by category</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(expensesByCategory).map(([category, amount], index) => {
                            const percentage = (amount / totalSpent) * 100
                            return (
                                <div key={category}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="p-2 rounded-lg"
                                                style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}
                                            >
                                                <span style={{ color: COLORS[index % COLORS.length] }}>
                                                    {categoryIcons[category] || <DollarSign className="h-5 w-5" />}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{categoryLabels[category] || category}</p>
                                                <p className="text-sm text-muted-foreground">{percentage.toFixed(1)}% of total</p>
                                            </div>
                                        </div>
                                        <span className="text-lg font-semibold">${amount.toLocaleString()}</span>
                                    </div>
                                    <Progress
                                        value={percentage}
                                        className="h-2"
                                        style={{ '--progress-color': COLORS[index % COLORS.length] } as React.CSSProperties}
                                    />
                                    {index < Object.entries(expensesByCategory).length - 1 && (
                                        <Separator className="mt-4" />
                                    )}
                                </div>
                            )
                        })}

                        {Object.keys(expensesByCategory).length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-30" />
                                <p>No expenses recorded yet</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
