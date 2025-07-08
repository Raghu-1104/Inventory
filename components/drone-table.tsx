"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  MapPin,
  Package,
  AlertTriangle,
  Truck,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DroneTableProps {
  drones: any[]
  headers: string[]
}

export function DroneTable({ drones, headers }: DroneTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Reset to first page when drones data changes
  useEffect(() => {
    setCurrentPage(1)
  }, [drones.length])

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return drones

    return drones.filter((row) =>
      Object.values(row).some((value) => value && String(value).toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [drones, searchTerm])

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn] || ""
      const bValue = b[sortColumn] || ""

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [filteredData, sortColumn, sortDirection])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedData.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedData, currentPage])

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  const handleSort = useCallback((column: string) => {
    setSortColumn((prevColumn) => {
      if (prevColumn === column) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
        return column
      } else {
        setSortDirection("asc")
        return column
      }
    })
    setCurrentPage(1)
  }, [])

  const getSortIcon = useCallback(
    (column: string) => {
      if (sortColumn !== column) return <ArrowUpDown className="w-4 h-4" />
      return sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
    },
    [sortColumn, sortDirection],
  )

  const getConditionBadge = useCallback((condition: string) => {
    if (condition === "Good") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Drones-SFC
        </Badge>
      )
    } else if (condition === "Destroyed") {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Destroyed
        </Badge>
      )
    } else {
      // Assuming "Bad"
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-200">
          <XCircle className="w-3 h-3 mr-1" />
          Bad
        </Badge>
      )
    }
  }, [])

  const getStatusBadge = useCallback((status: string) => {
    if (status === "In") {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200">
          <Package className="w-3 h-3 mr-1" />
          In Stock
        </Badge>
      )
    } else if (status === "In Transit") {
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200">
          <Truck className="w-3 h-3 mr-1" />
          In Transit
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-200">
          <MapPin className="w-3 h-3 mr-1" />
          Out
        </Badge>
      )
    }
  }, [])

  const getCategoryColor = useCallback((category: string) => {
    const colors = {
      "Cyber drones": "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200",
      "Racing drones": "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200",
      "Photography drones": "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200",
      "Surveillance drones": "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200",
      "Delivery drones": "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200",
    }
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-200"
    )
  }, [])

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-cyan-200 dark:border-cyan-600">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
            STUDIO TRIKA Inventory
          </span>
          <Badge
            variant="secondary"
            className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 animate-in fade-in-50"
          >
            {sortedData.length} drones
          </Badge>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search across all columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-cyan-200 dark:border-cyan-600 focus:border-cyan-400 dark:focus:border-cyan-400 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedData.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Results Found</h3>
            <p className="text-gray-500 dark:text-gray-500">
              {searchTerm ? `No drones match "${searchTerm}"` : "No drones available"}
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-cyan-200 dark:border-cyan-600 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950">
                    <tr>
                      {headers.map((header, index) => (
                        <th
                          key={index}
                          className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors"
                          onClick={() => handleSort(header)}
                        >
                          <div className="flex items-center space-x-2">
                            <span>{header}</span>
                            {getSortIcon(header)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {paginatedData.map((row, rowIndex) => (
                      <tr
                        key={`${row["Drone QR Code ID"]}-${rowIndex}`}
                        className={cn(
                          "hover:bg-cyan-50 dark:hover:bg-cyan-950 transition-colors animate-in fade-in-50",
                          row.Condition === "Bad" && "bg-orange-50/30 dark:bg-orange-950/30", // Changed from red-50/30
                          row.Condition === "Destroyed" && "bg-red-50/30 dark:bg-red-950/30", // Changed from amber-50/30
                          row["In/Out"] === "In Transit" && "bg-purple-50/30 dark:bg-purple-950/30",
                        )}
                        style={{ animationDelay: `${rowIndex * 50}ms` }}
                      >
                        {headers.map((header, colIndex) => (
                          <td key={colIndex} className="px-4 py-3 text-sm dark:text-gray-300">
                            {header === "Condition" ? (
                              getConditionBadge(row[header])
                            ) : header === "In/Out" ? (
                              getStatusBadge(row[header])
                            ) : header === "Category" ? (
                              <Badge className={getCategoryColor(row[header])}>{row[header]}</Badge>
                            ) : header === "Drone QR Code ID" ? (
                              <Badge variant="outline" className="font-mono">
                                {row[header]}
                              </Badge>
                            ) : (
                              <div className="max-w-xs truncate" title={String(row[header] || "")}>
                                {String(row[header] || "")}
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="border-cyan-200 hover:bg-cyan-50 dark:border-cyan-600 dark:hover:bg-cyan-900"
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          "transition-all duration-200",
                          currentPage === page
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                            : "border-cyan-200 hover:bg-cyan-50 dark:border-cyan-600 dark:hover:bg-cyan-900",
                        )}
                      >
                        {page}
                      </Button>
                    )
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="border-cyan-200 hover:bg-cyan-50 dark:border-cyan-600 dark:hover:bg-cyan-900"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
