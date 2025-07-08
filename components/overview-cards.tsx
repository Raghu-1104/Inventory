"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Columns, Hash, Type, TrendingUp } from "lucide-react"

interface OverviewCardsProps {
  analytics: any
}

export function OverviewCards({ analytics }: OverviewCardsProps) {
  const cards = [
    {
      title: "Total Rows",
      value: analytics.totalRows.toLocaleString(),
      icon: Database,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      title: "Total Columns",
      value: analytics.totalColumns.toString(),
      icon: Columns,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      title: "Numeric Columns",
      value: analytics.numericColumnsCount.toString(),
      icon: Hash,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      title: "Text Columns",
      value: analytics.textColumnsCount.toString(),
      icon: Type,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in fade-in-50 slide-in-from-bottom-4"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`w-4 h-4 ${card.textColor}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <Badge variant="secondary" className={`${card.bgColor} ${card.textColor} border-0`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          </CardContent>
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color}`} />
        </Card>
      ))}
    </div>
  )
}
