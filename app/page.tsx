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
    // Load data from csv.json on mount
    setDrones(csvData)
  }, [])

  // Remove upload logic, keep all analytics and filter code unchanged

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

          {drones.length > 0 && (
            <div className="mt-6">
              <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="dark:text-white">Delete All Inventory Data</AlertDialogTitle>
                    <AlertDialogDescription className="dark:text-gray-300">
                      This action cannot be undone. This will permanently delete all drone inventory data from the
                      system.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAllData}
                      className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                    >
                      Delete All Data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <Card className="border-2 border-dashed border-cyan-300 dark:border-cyan-600 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-cyan-700 dark:text-cyan-300">Upload Additional Drone Data</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Import Excel files to add more drones to your fleet
              </CardDescription>
            </CardHeader>
            <div className="p-6">
              <DroneUpload
                onFileUpload={handleFileUpload}
                onLoadingChange={handleLoadingChange}
                isLoading={isLoading}
              />
            </div>
          </Card>

          <DroneDashboard drones={drones} headers={headers} />
        </div>
      </div>
    </div>
  )
}
