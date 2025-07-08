"use client"

import { useState, useEffect } from "react"
import csvData from "./csv.json";
import { DroneUpload } from "@/components/drone-upload"
import { DroneDashboard } from "@/components/drone-dashboard"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
// import csvData from "./csv.json"; // Remove static import

export default function DroneManager() {
  const [drones, setDrones] = useState<any[]>([])

  const [headers] = useState([
    "Drone QR Code ID",
    "Drone ID",
    "Broken code",
    "Rack No",
    "Box No.",
    "Category",
    "In/Out",
    "Current Location",
    "Comments",
    "Condition",
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    // Normalize data from csv.json for analytics/filters
    const normalized = csvData.map(drone => ({
      ...drone,
      "In/Out": drone["In/In-Transit"] || drone["In/Out"] || "In",
      "Condition":
        drone["Broken code"] === "Broken"
          ? "Bad"
          : drone["Broken code"] === "Destroyed"
          ? "Destroyed"
          : "Good",
    }));
    setDrones(normalized);
  }, []);

  const handleFileUpload = async (fileData: any[], fileHeaders: string[]) => {
    const dataWithCondition = fileData.map((drone) => ({
      ...drone,
      Condition:
        drone["Broken code"] === "Broken"
          ? "Bad"
          : drone["Broken code"] === "Destroyed"
          ? "Destroyed"
          : "Good",
    }))
    setDrones(dataWithCondition)
    // Persist data to server
    await fetch("/api/save-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataWithCondition),
    })
  }

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading)
  }

  const handleDeleteAllData = () => {
    setDrones([])
    setShowDeleteConfirm(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-100 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Theme Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/trika-logo-white.png"
              alt="Studio Trika Logo"
              className="h-16 w-auto filter drop-shadow-lg dark:brightness-0 dark:invert"
            />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
            STUDIO TRIKA
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Professional Drone Inventory Management System</p>
        </div>

        <div className="space-y-8">
          {/* Upload and delete UI removed */}
          <DroneDashboard drones={drones} headers={headers} />
        </div>
      </div>
    </div>
  )
}
