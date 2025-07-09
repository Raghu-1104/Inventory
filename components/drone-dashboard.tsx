"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { DroneAnalytics } from "@/components/drone-analytics"
import { DroneTable } from "@/components/drone-table"
import { DroneFilters } from "@/components/drone-filters"
import { DroneTransit } from "@/components/drone-transit"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Table, TrendingUp, Truck } from "lucide-react"

interface DroneDashboardProps {
  drones: any[]
  headers: string[]
}

export function DroneDashboard({ drones, headers }: DroneDashboardProps) {
  const [filteredDrones, setFilteredDrones] = useState(drones)
  const [activeTab, setActiveTab] = useState("analytics")
  const [transitDrones, setTransitDrones] = useState<any[]>([])

  // Update filtered drones when drones prop changes
  useEffect(() => {
    setFilteredDrones(drones)
  }, [drones])

  const handleFilterChange = useCallback((filtered: any[]) => {
    setFilteredDrones(filtered)
  }, [])

  const analytics = useMemo(() => {
    // Only include drones whose status was set from the nested In.Out field
    const statusFromInOut = filteredDrones.filter(drone => {
      // If the original drone object had a nested In.Out field, mark it
      return drone["In"] && typeof drone["In"] === "object" && typeof drone["In"].Out === "string" && drone["In"].Out.trim() !== "";
    });

    const total = statusFromInOut.length;
    const goodCondition = statusFromInOut.filter((drone) => drone.Condition === "Good").length;
    const badCondition = statusFromInOut.filter((drone) => drone.Condition === "Bad").length;
    const destroyedCondition = statusFromInOut.filter((drone) => drone.Condition === "Destroyed").length;
    const inStock = statusFromInOut.filter((drone) => drone["In/Out"] === "In").length;
    const outStock = statusFromInOut.filter((drone) => drone["In/Out"] === "Out").length;

    const categories = statusFromInOut.reduce(
      (acc, drone) => {
        const category = drone.Category || "Unknown";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const locations = statusFromInOut.reduce(
      (acc, drone) => {
        const location = drone["Current Location"] || "Unknown";
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total,
      goodCondition,
      badCondition,
      destroyedCondition,
      inStock,
      outStock,
      categories,
      locations,
    };
  }, [filteredDrones]);

  return (
    <div className="space-y-6">
      <DroneFilters drones={drones} onFilterChange={handleFilterChange} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm dark:bg-gray-800/70">
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="table"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white"
          >
            <Table className="w-4 h-4 mr-2" />
            Data Table
          </TabsTrigger>
          <TabsTrigger
            value="charts"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Charts
          </TabsTrigger>
          <TabsTrigger
            value="transit"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white"
          >
            <Truck className="w-4 h-4 mr-2" />
            In Transit ({transitDrones.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6 animate-in fade-in-50 duration-500">
          <DroneAnalytics analytics={analytics} drones={filteredDrones} transitCount={transitDrones.length} />
        </TabsContent>

        <TabsContent value="table" className="animate-in fade-in-50 duration-500">
          <DroneTable drones={filteredDrones} headers={headers} />
        </TabsContent>

        <TabsContent value="charts" className="animate-in fade-in-50 duration-500">
          <DroneAnalytics
            analytics={analytics}
            drones={filteredDrones}
            transitCount={transitDrones.length}
            showChartsOnly={true}
          />
        </TabsContent>

        <TabsContent value="transit" className="animate-in fade-in-50 duration-500">
          <DroneTransit
            availableDrones={drones.filter((drone) => drone["In/Out"] === "In" && drone.Condition === "Good")}
            transitDrones={transitDrones}
            onTransitUpdate={setTransitDrones}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
