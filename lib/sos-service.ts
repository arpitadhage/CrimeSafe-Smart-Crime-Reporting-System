export class SOSService {
  private static instance: SOSService
  private sosHandlers: Set<(alert: SOSAlert) => void> = new Set()

  static getInstance(): SOSService {
    if (!SOSService.instance) {
      SOSService.instance = new SOSService()
    }
    return SOSService.instance
  }

  sendSOSAlert(userId: string, location?: GeolocationPosition): Promise<boolean> {
    return new Promise((resolve) => {
      console.log("[CrimeSafe] SOS Alert triggered!")

      const alert: SOSAlert = {
        id: Date.now().toString(),
        userId,
        timestamp: new Date(),
        location: location
          ? {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              accuracy: location.coords.accuracy,
            }
          : undefined,
        status: "active",
      }

      // Simulate UDP-style instant transmission to all nearby stations
      setTimeout(() => {
        console.log("[CrimeSafe] SOS Alert sent to all nearby police stations")

        // Notify all SOS handlers (police stations)
        this.sosHandlers.forEach((handler) => handler(alert))

        resolve(true)
      }, 100) // Very fast, simulating UDP
    })
  }

  onSOSAlert(handler: (alert: SOSAlert) => void): () => void {
    this.sosHandlers.add(handler)

    // Return cleanup function
    return () => {
      this.sosHandlers.delete(handler)
    }
  }

  getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"))
        return
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      })
    })
  }
}

interface SOSAlert {
  id: string
  userId: string
  timestamp: Date
  location?: {
    latitude: number
    longitude: number
    accuracy: number
  }
  status: "active" | "responded" | "resolved"
}
