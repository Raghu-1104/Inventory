"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import * as XLSX from "xlsx"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileUpload: (data: any[], headers: string[], fileName: string) => void
  onLoadingChange: (loading: boolean) => void
  isLoading: boolean
}

export function FileUpload({ onFileUpload, onLoadingChange, isLoading }: FileUploadProps) {
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
            onFileUpload(data, headers, file.name)
            onLoadingChange(false)
          }, 1000) // Add a small delay for better UX
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
    <Card className="border-2 border-dashed transition-all duration-300 hover:border-blue-400">
      <CardContent className="p-8">
        <div
          {...getRootProps()}
          className={cn(
            "text-center cursor-pointer transition-all duration-300 rounded-lg p-8",
            isDragActive && "bg-blue-50 border-blue-300",
            dragActive && "scale-105",
          )}
        >
          <input {...getInputProps()} />

          {isLoading ? (
            <div className="space-y-4 animate-in fade-in-50">
              <Loader2 className="w-16 h-16 mx-auto text-blue-500 animate-spin" />
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Processing your file...</h3>
                <p className="text-gray-500">Please wait while we parse your Excel data</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div
                  className={cn(
                    "p-4 rounded-full transition-all duration-300",
                    isDragActive ? "bg-blue-100 scale-110" : "bg-gray-100",
                  )}
                >
                  {isDragActive ? (
                    <Upload className="w-12 h-12 text-blue-500" />
                  ) : (
                    <FileSpreadsheet className="w-12 h-12 text-gray-400" />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {isDragActive ? "Drop your file here" : "Upload your Excel file"}
                </h3>
                <p className="text-gray-500 mb-4">
                  Drag and drop your .xlsx, .xls, or .csv file here, or click to browse
                </p>
                <Button variant="outline" className="transition-all duration-300 hover:scale-105 bg-transparent">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>

              <div className="text-xs text-gray-400">Supported formats: .xlsx, .xls, .csv</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
