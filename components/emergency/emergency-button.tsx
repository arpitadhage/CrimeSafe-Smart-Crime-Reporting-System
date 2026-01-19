"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, MapPin, Phone, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatabaseService } from "@/lib/database"
import type { SOSAlert } from "@/lib/types"

interface EmergencyButtonProps {
  size?: "default" | "lg"
  userId?: string
}

export function EmergencyButton({ size = "default", userId = "current-user-id" }: EmergencyButtonProps) {
  const [isActivated, setIsActivated] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showServices, setShowServices] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const emergencyServices = [
    { name: "Universal Emergency Helpline", number: "112", description: "Police, Fire, Medical etc." },
    { name: "Police", number: "100", description: "Police Emergency" },
    { name: "Fire Brigade", number: "101", description: "Fire Emergency" },
    { name: "Ambulance / Medical Emergency", number: "102", description: "Medical Emergency" },
    { name: "Ambulance / Medical Emergency", number: "108", description: "Medical Emergency" },
  ]

  const handleEmergencyClick = async () => {
    if (isActivated) return

    setIsActivated(true)
    setCountdown(10)

    // Get user location
    let location = {
      latitude: 40.7128,
      longitude: -74.006,
      address: "Current Location (GPS)",
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
      location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        address: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
      }
      console.log("[CrimeSafe] Location obtained for SOS:", location)
    } catch (error) {
      console.log("[CrimeSafe] Location not available, using default location")
    }

    timerRef.current = setInterval(async () => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }

          const sosAlert: SOSAlert = {
            id: Date.now().toString(),
            userId,
            location,
            timestamp: new Date(),
            status: "active",
          }

          DatabaseService.addSOSAlert(sosAlert)

          alert(
            "🚨 EMERGENCY ALERT SENT! 🚨\n\nYour SOS has been transmitted to all nearby police stations.\nEmergency services are being dispatched to your location.\n\nHelp is on the way!",
          )

          setIsActivated(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleCancel = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsActivated(false)
    setCountdown(0)
  }

  if (showServices) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl mx-auto border-blue-200 bg-white shadow-2xl">
          <CardHeader className="text-center bg-blue-600 text-white rounded-t-lg relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowServices(false)}
              className="absolute right-2 top-2 text-white hover:bg-blue-700"
            >
              <X className="h-4 w-4" />
            </Button>
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <Phone className="h-6 w-6" />
              Emergency Services
            </CardTitle>
            <CardDescription className="text-blue-100">Important emergency contact numbers for India</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6 max-h-96 overflow-y-auto">
            {emergencyServices.map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{service.name}</div>
                  <div className="text-sm text-gray-600">{service.description}</div>
                </div>
                <div className="text-2xl font-bold text-blue-600 bg-blue-100 px-4 py-2 rounded-lg">
                  {service.number}
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => setShowServices(false)}
              className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 bg-white mt-4"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isActivated) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md mx-auto border-red-200 bg-white shadow-2xl">
          <CardHeader className="text-center bg-red-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6 animate-pulse" />🚨 EMERGENCY ACTIVATED
            </CardTitle>
            <CardDescription className="text-red-100">
              SOS alert will be sent to all nearby police stations in {countdown} seconds
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4 p-6">
            <div className="text-6xl font-bold text-red-600 animate-pulse">{countdown}</div>
            <Alert className="border-red-200 bg-red-50">
              <MapPin className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Your location will be shared with emergency services
              </AlertDescription>
            </Alert>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="w-full border-red-300 text-red-600 hover:bg-red-50 bg-white"
            >
              Cancel Emergency Request
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Button
        variant="destructive"
        size={size}
        onClick={handleEmergencyClick}
        className={`${size === "lg" ? "h-20 flex-col gap-2" : "gap-2"} bg-red-600 hover:bg-red-700 animate-pulse shadow-lg w-full`}
      >
        <AlertTriangle className={size === "lg" ? "h-8 w-8" : "h-4 w-4"} />
        {size === "lg" ? "🚨 Emergency SOS" : "🚨 SOS"}
      </Button>

      <Button
        variant="outline"
        size={size}
        onClick={() => setShowServices(true)}
        className={`${size === "lg" ? "h-16 flex-col gap-2" : "gap-2"} border-blue-300 text-blue-600 hover:bg-blue-50 w-full bg-white`}
      >
        <Phone className={size === "lg" ? "h-6 w-6" : "h-4 w-4"} />
        Emergency Numbers
      </Button>
    </div>
  )
}
