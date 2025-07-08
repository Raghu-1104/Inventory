"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BarChart3, TrendingUp, Table, Upload, FileSpreadsheet, Home, Plus } from "lucide-react"

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  hasData: boolean
  fileName: string
  onNewFile: () => void
}

const navigationItems = [
  { id: "dashboard", label: "Overview", icon: Home },
  { id: "charts", label: "Charts", icon: BarChart3 },
  { id: "analytics", label: "Analytics", icon: TrendingUp },
  { id: "table", label: "Data Table", icon: Table },
]

export function Sidebar({ activeView, onViewChange, hasData, fileName, onNewFile }: SidebarProps) {
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 lg:block hidden">
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Excel Dashboard
              </h1>
              <p className="text-xs text-gray-500">Data Visualization</p>
            </div>
          </div>
        </div>

        {/* Current File Info */}
        {hasData && (
          <div className="p-4 animate-in fade-in-50 duration-500">
            <Card className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900 truncate">{fileName}</p>
                  <p className="text-xs text-blue-600">Active Dataset</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {!hasData ? (
            <Button
              onClick={() => onViewChange("upload")}
              className={cn(
                "w-full justify-start space-x-3 transition-all duration-200",
                activeView === "upload"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700",
              )}
            >
              <Upload className="w-4 h-4" />
              <span>Upload File</span>
            </Button>
          ) : (
            <>
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "w-full justify-start space-x-3 transition-all duration-200 hover:scale-105",
                    activeView === item.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700",
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              ))}

              <div className="pt-4 border-t border-gray-200/50 mt-4">
                <Button
                  onClick={onNewFile}
                  variant="outline"
                  className="w-full justify-start space-x-3 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 bg-transparent"
                >
                  <Plus className="w-4 h-4" />
                  <span>New File</span>
                </Button>
              </div>
            </>
          )}
        </nav>
      </div>
    </div>
  )
}
