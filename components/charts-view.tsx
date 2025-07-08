"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

interface ChartsViewProps {
  data: any[]
  headers: string[]
  analytics: any
}

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#6366F1", "#EC4899", "#14B8A6"]

export function ChartsView({ data, headers, analytics }: ChartsViewProps) {
  const chartData = useMemo(() => {
    const numericColumns = analytics.numericColumns.slice(0, 2) // Take first 2 numeric columns
    const firstTextColumn = headers.find((header) => !analytics.numericColumns.includes(header))

    if (numericColumns.length === 0 || !firstTextColumn) return []

    // Group data by first text column and sum numeric values
    const grouped = data.reduce((acc, row) => {
      const key = row[firstTextColumn] || "Unknown"
      if (!acc[key]) {
        acc[key] = { name: key }
        numericColumns.forEach((col) => (acc[key][col] = 0))
      }
      numericColumns.forEach((col) => {
        const value = Number.parseFloat(row[col])
        if (!isNaN(value)) acc[key][col] += value
      })
      return acc
    }, {} as any)

    return Object.values(grouped).slice(0, 10) // Limit to 10 items for readability
  }, [data, headers, analytics])

  const pieData = useMemo(() => {
    const firstTextColumn = headers.find((header) => !analytics.numericColumns.includes(header))
    if (!firstTextColumn) return []

    const counts = data.reduce((acc, row) => {
      const key = row[firstTextColumn] || "Unknown"
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as any)

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .slice(0, 8) // Limit to 8 slices
  }, [data, headers, analytics])

  const lineData = useMemo(() => {
    if (analytics.numericColumns.length === 0) return []

    const firstNumericColumn = analytics.numericColumns[0]
    return data.slice(0, 20).map((row, index) => ({
      index: index + 1,
      value: Number.parseFloat(row[firstNumericColumn]) || 0,
    }))
  }, [data, analytics])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <Card className="animate-in fade-in-50 duration-500 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span>Data Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              {analytics.numericColumns.slice(0, 2).map((column: string, index: number) => (
                <Bar key={column} dataKey={column} fill={COLORS[index]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card className="animate-in fade-in-50 duration-700 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full" />
            <span>Category Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card className="animate-in fade-in-50 duration-900 hover:shadow-lg transition-shadow lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span>Trend Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="index" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
