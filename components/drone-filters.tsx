"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, RefreshCw } from "lucide-react"

interface DroneFiltersProps {
  drones: any[]
  onFilterChange: (filtered: any[]) => void
}

export function DroneFilters({ drones, onFilterChange }: DroneFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [conditionFilter, setConditionFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const categories = [...new Set(drones.map((drone) => drone.Category).filter(Boolean))]
  const locations = [...new Set(drones.map((drone) => drone["Current Location"]).filter(Boolean))]

  const applyFilters = useCallback(() => {
    let filtered = [...drones]

    if (searchTerm.trim()) {
      filtered = filtered.filter((drone) =>
        Object.values(drone).some((value) => value && String(value).toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((drone) => drone.Category === categoryFilter)
    }

    if (conditionFilter !== "all") {
      filtered = filtered.filter((drone) => drone.Condition === conditionFilter)
    }

    if (locationFilter !== "all") {
      filtered = filtered.filter((drone) => drone["Current Location"] === locationFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((drone) => drone["In/Out"] === statusFilter)
    }

    onFilterChange(filtered)
  }, [drones, searchTerm, categoryFilter, conditionFilter, locationFilter, statusFilter, onFilterChange])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const clearFilters = useCallback(() => {
    setSearchTerm("")
    setCategoryFilter("all")
    setConditionFilter("all")
    setLocationFilter("all")
    setStatusFilter("all")
  }, [])

  const activeFiltersCount =
    [categoryFilter, conditionFilter, locationFilter, statusFilter].filter((f) => f !== "all").length +
    (searchTerm.trim() ? 1 : 0)

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 border-cyan-200 dark:border-cyan-600">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-cyan-600" />
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
              STUDIO TRIKA Filters
            </span>
          </div>
          {activeFiltersCount > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200">
                {activeFiltersCount} active
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="hover:bg-red-50 hover:border-red-300 bg-transparent"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Clear
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search drones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-cyan-200 dark:border-cyan-600 focus:border-cyan-400 dark:focus:border-cyan-400 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="border-cyan-200 dark:border-cyan-600 focus:border-cyan-400 dark:focus:border-cyan-400 dark:bg-gray-700 dark:text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Condition Filter */}
          <Select value={conditionFilter} onValueChange={setConditionFilter}>
            <SelectTrigger className="border-cyan-200 dark:border-cyan-600 focus:border-cyan-400 dark:focus:border-cyan-400 dark:bg-gray-700 dark:text-white">
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Bad">Bad</SelectItem>
              <SelectItem value="Destroyed">Destroyed</SelectItem>
            </SelectContent>
          </Select>

          {/* Location Filter */}
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="border-cyan-200 dark:border-cyan-600 focus:border-cyan-400 dark:focus:border-cyan-400 dark:bg-gray-700 dark:text-white">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-cyan-200 dark:border-cyan-600 focus:border-cyan-400 dark:focus:border-cyan-400 dark:bg-gray-700 dark:text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="In">In Stock</SelectItem>
              <SelectItem value="Out">Out</SelectItem>
              <SelectItem value="In Transit">In Transit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
