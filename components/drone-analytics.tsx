"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Zap, CheckCircle, XCircle, MapPin, Package, Activity, Target, AlertTriangle } from "lucide-react"

interface DroneAnalyticsProps {
  analytics: any
  drones: any[]
  transitCount: number
  showChartsOnly?: boolean
}

const COLORS = {
  good: "#FAFA33", // Bright yellow
  bad: "#C2410C", // Dark orange (Tailwind orange-700)
  destroyed: "#B91C1C", // Completely red (Tailwind red-700)
  in: "#3B82F6",
  out: "#F59E0B",
  transit: "#8B5CF6",
  categories: ["#8B5CF6", "#06B6D4", "#84CC16", "#F97316", "#EC4899", "#6366F1"],
}

export function DroneAnalytics({ analytics, drones, transitCount, showChartsOnly = false }: DroneAnalyticsProps) {
  const conditionData = [
    { name: "Drone-SFC", value: analytics.goodCondition, color: COLORS.good }, // Changed label here
    { name: "Bad", value: analytics.badCondition, color: COLORS.bad },
    { name: "Destroyed", value: analytics.destroyedCondition, color: COLORS.destroyed },
  ]

  const statusData = [
    { name: "In Stock", value: analytics.inStock, color: COLORS.in },
    { name: "Out", value: analytics.outStock, color: COLORS.out },
    { name: "In Transit", value: transitCount, color: COLORS.transit },
  ]

  const categoryData = Object.entries(analytics.categories).map(([name, value]) => ({
    name,
    value,
  }))

  const locationData = Object.entries(analytics.locations).map(([name, value]) => ({
    name: name.length > 15 ? name.substring(0, 15) + "..." : name,
    value,
  }))

  if (showChartsOnly) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Condition Chart */}
        <Card className="bg-gradient-to-br from-yellow-50 to-red-50 dark:from-yellow-950/30 dark:to-red-950/30 border-2 border-yellow-200 dark:border-yellow-600 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-yellow-600" />
              <span>Fleet Condition</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={conditionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {conditionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Chart */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-200 dark:border-blue-600 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span>Status Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-2 border-purple-200 dark:border-purple-600 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span>Category Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Location Distribution */}
        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-2 border-cyan-200 dark:border-cyan-600 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-cyan-600" />
              <span>Location Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in fade-in-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Drones</p>
                <p className="text-3xl font-bold">{analytics.total}</p>
              </div>
              <Zap className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#FAFA33] text-gray-800 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in fade-in-50 delay-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 text-sm font-medium">Drones-SFC</p>
                <p className="text-3xl font-bold">{analytics.goodCondition}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-gray-700" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-700 to-orange-800 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in fade-in-50 delay-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Bad Condition</p>
                <p className="text-3xl font-bold">{analytics.badCondition}</p>
              </div>
              <XCircle className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-700 to-red-800 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in fade-in-50 delay-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Destroyed</p>
                <p className="text-3xl font-bold">{analytics.destroyedCondition}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-2 border-blue-200 dark:border-blue-600 animate-in fade-in-50 delay-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="dark:text-white">Status Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{analytics.inStock}</div>
              <div className="text-sm text-blue-800 dark:text-blue-300">In Stock</div>
            </div>
            <div className="text-center p-4 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{analytics.outStock}</div>
              <div className="text-sm text-orange-800 dark:text-orange-300">Out</div>
            </div>
            <div className="text-center p-4 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{transitCount}</div>
              <div className="text-sm text-purple-800 dark:text-purple-300">In Transit</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Condition Chart */}
        <Card className="bg-gradient-to-br from-yellow-50 to-red-50 dark:from-yellow-950/30 dark:to-red-950/30 border-2 border-yellow-200 dark:border-yellow-600 hover:shadow-xl transition-all duration-300 animate-in fade-in-50 delay-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-yellow-600" />
              <span>Fleet Condition</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={conditionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {conditionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Chart */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-200 dark:border-blue-600 hover:shadow-xl transition-all duration-300 animate-in fade-in-50 delay-900">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span>Status Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
