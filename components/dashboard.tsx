"use client"

import { useMemo } from "react"
import { OverviewCards } from "@/components/overview-cards"
import { ChartsView } from "@/components/charts-view"
import { AnalyticsView } from "@/components/analytics-view"
import { DataTable } from "@/components/data-table"

interface DashboardProps {
  data: any[]
  headers: string[]
  fileName: string
  activeView: string
}

export function Dashboard({ data, headers, fileName, activeView }: DashboardProps) {
  const analytics = useMemo(() => {
    const numericColumns = headers.filter((header) => {
      return data.some((row) => !isNaN(Number.parseFloat(row[header])) && isFinite(row[header]))
    })

    const totalRows = data.length
    const totalColumns = headers.length
    const numericColumnsCount = numericColumns.length
    const textColumnsCount = totalColumns - numericColumnsCount

    // Calculate some basic statistics
    const stats = numericColumns.reduce((acc, column) => {
      const values = data.map((row) => Number.parseFloat(row[column])).filter((val) => !isNaN(val))
      if (values.length > 0) {
        acc[column] = {
          sum: values.reduce((a, b) => a + b, 0),
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length,
        }
      }
      return acc
    }, {} as any)

    return {
      totalRows,
      totalColumns,
      numericColumns,
      numericColumnsCount,
      textColumnsCount,
      stats,
    }
  }, [data, headers])

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            <OverviewCards analytics={analytics} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartsView data={data} headers={headers} analytics={analytics} />
            </div>
          </div>
        )
      case "charts":
        return <ChartsView data={data} headers={headers} analytics={analytics} />
      case "analytics":
        return <AnalyticsView data={data} headers={headers} analytics={analytics} />
      case "table":
        return <DataTable data={data} headers={headers} />
      default:
        return <div>View not found</div>
    }
  }

  return <div className="space-y-6">{renderView()}</div>
}
