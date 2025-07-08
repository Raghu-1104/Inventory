"use client"

import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet, Database } from "lucide-react"

interface HeaderProps {
  fileName: string
  dataCount: number
}

export function Header({ fileName, dataCount }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">{fileName || "Excel Dashboard"}</h2>
          </div>
          {dataCount > 0 && (
            <div className="flex items-center space-x-2 animate-in fade-in-50 duration-500">
              <Database className="w-4 h-4 text-blue-600" />
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {dataCount.toLocaleString()} rows
              </Badge>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </header>
  )
}
