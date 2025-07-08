"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, Plus, MapPin, Clock, Calendar, Trash2, Navigation } from "lucide-react"
import { cn } from "@/lib/utils"

interface TransitDrone {
  id: string
  droneId: string
  droneQRCode: string
  from: string
  to: string
  shippingDateTime: string
  eta: string
  status: "In Transit" | "Delivered" | "Delayed"
}

interface DroneTransitProps {
  availableDrones: any[]
  transitDrones: TransitDrone[]
  onTransitUpdate: (drones: TransitDrone[]) => void
}

export function DroneTransit({ availableDrones, transitDrones, onTransitUpdate }: DroneTransitProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedDrone, setSelectedDrone] = useState("")
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [shippingDateTime, setShippingDateTime] = useState("")
  const [eta, setEta] = useState("")

  const handleAddTransit = () => {
    if (!selectedDrone || !fromLocation || !toLocation || !shippingDateTime || !eta) {
      return
    }

    const drone = availableDrones.find((d) => d["Drone QR Code ID"] === selectedDrone)
    if (!drone) return

    const newTransit: TransitDrone = {
      id: Date.now().toString(),
      droneId: drone["Drone ID"] || "N/A",
      droneQRCode: drone["Drone QR Code ID"],
      from: fromLocation,
      to: toLocation,
      shippingDateTime,
      eta,
      status: "In Transit",
    }

    onTransitUpdate([...transitDrones, newTransit])

    // Reset form
    setSelectedDrone("")
    setFromLocation("")
    setToLocation("")
    setShippingDateTime("")
    setEta("")
    setShowAddForm(false)
  }

  const handleRemoveTransit = (id: string) => {
    onTransitUpdate(transitDrones.filter((drone) => drone.id !== id))
  }

  const handleStatusChange = (id: string, status: "In Transit" | "Delivered" | "Delayed") => {
    onTransitUpdate(transitDrones.map((drone) => (drone.id === id ? { ...drone, status } : drone)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Transit":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200">
            <Truck className="w-3 h-3 mr-1" />
            In Transit
          </Badge>
        )
      case "Delivered":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200">
            <MapPin className="w-3 h-3 mr-1" />
            Delivered
          </Badge>
        )
      case "Delayed":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200">
            <Clock className="w-3 h-3 mr-1" />
            Delayed
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 border-2 border-orange-200 dark:border-orange-600">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="w-6 h-6 text-orange-600" />
              <span className="bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                Drone Transit Management
              </span>
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Transit
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Add Transit Form */}
      {showAddForm && (
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-orange-200 dark:border-orange-600 animate-in fade-in-50 slide-in-from-top-4">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-orange-600" />
              <span>Add New Transit</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="drone-select">Select Drone</Label>
                <Select value={selectedDrone} onValueChange={setSelectedDrone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose available drone" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDrones.map((drone) => (
                      <SelectItem key={drone["Drone QR Code ID"]} value={drone["Drone QR Code ID"]}>
                        QR: {drone["Drone QR Code ID"]} - {drone["Drone ID"] || "N/A"} ({drone.Category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="from-location">From Location</Label>
                <Input
                  id="from-location"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  placeholder="Origin location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="to-location">To Location</Label>
                <Input
                  id="to-location"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  placeholder="Destination location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipping-datetime">Shipping Date & Time</Label>
                <Input
                  id="shipping-datetime"
                  type="datetime-local"
                  value={shippingDateTime}
                  onChange={(e) => setShippingDateTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eta">Estimated Arrival (ETA)</Label>
                <Input id="eta" type="datetime-local" value={eta} onChange={(e) => setEta(e.target.value)} />
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                onClick={handleAddTransit}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                Add to Transit
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transit List */}
      {transitDrones.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {transitDrones.map((drone, index) => (
            <Card
              key={drone.id}
              className={cn(
                "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 hover:shadow-lg transition-all duration-300 animate-in fade-in-50 slide-in-from-left-4",
                drone.status === "In Transit" && "border-blue-200 dark:border-blue-600",
                drone.status === "Delivered" && "border-green-200 dark:border-green-600",
                drone.status === "Delayed" && "border-red-200 dark:border-red-600",
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="font-mono">
                      QR: {drone.droneQRCode}
                    </Badge>
                    <Badge variant="secondary">ID: {drone.droneId}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={drone.status}
                      onValueChange={(value: "In Transit" | "Delivered" | "Delayed") =>
                        handleStatusChange(drone.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In Transit">In Transit</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Delayed">Delayed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveTransit(drone.id)}
                      className="text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>From</span>
                    </div>
                    <p className="font-medium">{drone.from}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Navigation className="w-3 h-3" />
                      <span>To</span>
                    </div>
                    <p className="font-medium">{drone.to}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>Shipped</span>
                    </div>
                    <p className="font-medium">{new Date(drone.shippingDateTime).toLocaleString()}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>ETA</span>
                    </div>
                    <p className="font-medium">{new Date(drone.eta).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  {getStatusBadge(drone.status)}
                  <div className="text-sm text-gray-500">Transit ID: {drone.id}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <Truck className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No Drones In Transit</h3>
            <p className="text-gray-500 dark:text-gray-500 mb-4">
              Add drones to transit to track their shipping and delivery status.
            </p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Transit
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
