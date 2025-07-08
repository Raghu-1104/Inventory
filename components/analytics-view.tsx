"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Calculator, Target, Zap } from "lucide-react"

interface AnalyticsViewProps {
  data: any[]
  headers: string[]
  analytics: any
}

export function AnalyticsView({ data, headers, analytics }: AnalyticsViewProps) {
  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(analytics.stats).map(([column, stats]: [string, any], index) => (
          <Card
            key={column}
            className="animate-in fade-in-50 slide-in-from-bottom-4 hover:shadow-lg transition-all duration-300"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="truncate">{column}</span>
                <Calculator className="w-5 h-5 text-blue-500" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Sum</p>
                  <p className="text-xl font-bold text-green-600">
                    {stats.sum.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Average</p>
                  <p className="text-xl font-bold text-blue-600">
                    {stats.avg.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Min</span>
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    {stats.min.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Max</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stats.max.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Count</span>
                  <Badge variant="secondary">
                    <Target className="w-3 h-3 mr-1" />
                    {stats.count.toLocaleString()}
                  </Badge>
                </div>
              </div>

              {/* Range visualization */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Range</span>
                  <span>{(((stats.max - stats.min) / stats.max) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={((stats.max - stats.min) / stats.max) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Quality Insights */}
      <Card className="animate-in fade-in-50 duration-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span>Data Quality Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalRows}</div>
              <div className="text-sm text-blue-800">Total Records</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{analytics.numericColumnsCount}</div>
              <div className="text-sm text-green-800">Numeric Fields</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{analytics.textColumnsCount}</div>
              <div className="text-sm text-purple-800">Text Fields</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {((analytics.numericColumnsCount / analytics.totalColumns) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-orange-800">Numeric Ratio</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Column Analysis */}
      <Card className="animate-in fade-in-50 duration-1000">
        <CardHeader>
          <CardTitle>Column Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {headers.map((header, index) => {
              const isNumeric = analytics.numericColumns.includes(header)
              const uniqueValues = new Set(data.map((row) => row[header])).size
              const completeness =
                (data.filter((row) => row[header] !== null && row[header] !== undefined && row[header] !== "").length /
                  data.length) *
                100

              return (
                <div
                  key={header}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors animate-in fade-in-50"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{header}</h4>
                      <Badge variant={isNumeric ? "default" : "secondary"}>{isNumeric ? "Numeric" : "Text"}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>Unique: {uniqueValues}</span>
                      <span>Complete: {completeness.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="w-24">
                    <Progress value={completeness} className="h-2" />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
