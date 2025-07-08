"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import * as XLSX from "xlsx"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Zap, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface DroneUploadProps {
  onFileUpload: (data: any[], headers: string[]) => void
  onLoadingChange: (loading: boolean) => void
  isLoading: boolean
}

export function DroneUpload({ onFileUpload, onLoadingChange, isLoading }: DroneUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const processFile = useCallback(
    async (file: File) => {
      onLoadingChange(true)

      try {
        const arrayBuffer = await file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        if (jsonData.length > 0) {
          const headers = jsonData[0] as string[]
          const data = jsonData.slice(1).map((row: any) => {
            const rowData: any = {}
            headers.forEach((header, index) => {
              rowData[header] = row[index] || ""
            })
            return rowData
          })

          setTimeout(() => {
            onFileUpload(data, headers)
            onLoadingChange(false)
          }, 1000)
        }
      } catch (error) {
        console.error("Error processing file:", error)
        onLoadingChange(false)
      }
    },
    [onFileUpload, onLoadingChange],
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        processFile(file)
      }
    },
    [processFile],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  })

  return (
    <Card className="border-2 border-dashed transition-all duration-300 hover:border-cyan-400 dark:hover:border-cyan-500 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={cn(
            "text-center cursor-pointer transition-all duration-300 rounded-lg p-6",
            isDragActive && "bg-cyan-50 dark:bg-cyan-950/50 border-cyan-300 dark:border-cyan-600 scale-105",
          )}
        >
          <input {...getInputProps()} />

          {isLoading ? (
            <div className="space-y-4 animate-in fade-in-50">
              <Loader2 className="w-12 h-12 mx-auto text-cyan-500 animate-spin" />
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Processing STUDIO TRIKA inventory...
                </h3>
                <p className="text-gray-500 dark:text-gray-400">Updating STUDIO TRIKA database</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div
                  className={cn(
                    "p-3 rounded-full transition-all duration-300",
                    isDragActive
                      ? "bg-cyan-100 dark:bg-cyan-900 scale-110"
                      : "bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900",
                  )}
                >
                  {isDragActive ? (
                    <Upload className="w-8 h-8 text-cyan-500" />
                  ) : (
                    <Zap className="w-8 h-8 text-cyan-600" />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isDragActive ? "Drop your drone data here" : "Upload STUDIO TRIKA inventory"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Drag and drop your Excel file or click to browse
                </p>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 hover:scale-105">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
