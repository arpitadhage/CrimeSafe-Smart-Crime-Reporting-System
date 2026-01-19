"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader, MapPin, AlertTriangle } from "lucide-react"
import type { Hotspot } from "@/lib/hotspot-service"
import { HotspotService } from "@/lib/hotspot-service"
import { DatabaseService } from "@/lib/database"

export function CrimeHotspotMap() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  const [stats, setStats] = useState({
    totalHotspots: 0,
    highRiskAreas: 0,
    mediumRiskAreas: 0,
    lowRiskAreas: 0,
  })

  useEffect(() => {
    loadHotspots()
  }, [])

  const loadHotspots = async () => {
    setLoading(true)
    setError(null)

    try {
      const reports = DatabaseService.loadReports()
      const sosAlerts = DatabaseService.loadSOSAlerts()

      // Predict hotspots using ML model
      const result = await HotspotService.predictHotspots(reports, sosAlerts)

      if (!result.success) {
        setError(result.error || "Failed to predict hotspots")
        setHotspots([])
        return
      }

      setHotspots(result.hotspots)

      // Calculate statistics
      const stats = {
        totalHotspots: result.hotspots.length,
        highRiskAreas: result.hotspots.filter((h) => h.risk_level === "High").length,
        mediumRiskAreas: result.hotspots.filter((h) => h.risk_level === "Medium").length,
        lowRiskAreas: result.hotspots.filter((h) => h.risk_level === "Low").length,
      }

      setStats(stats)
    } catch (err) {
      console.error("[CrimeHotspotMap] Error loading hotspots:", err)
      setError(err instanceof Error ? err.message : "Failed to load hotspots")
    } finally {
      setLoading(false)
    }
  }

  const getRiskBadgeVariant = (riskLevel: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (riskLevel) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crime Hotspot Analysis</CardTitle>
          <CardDescription>ML-powered geographic crime clustering</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Loader className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
              <p className="text-muted-foreground">Analyzing crime data with ML...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crime Hotspot Analysis</CardTitle>
          <CardDescription>ML-powered geographic crime clustering</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (hotspots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Crime Hotspot Analysis</CardTitle>
          <CardDescription>ML-powered geographic crime clustering</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertDescription>No sufficient crime data available for hotspot analysis</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crime Hotspot Analysis</CardTitle>
        <CardDescription>ML-powered K-Means clustering for crime prediction</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{stats.totalHotspots}</div>
            <div className="text-xs text-gray-600">Total Hotspots</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">{stats.highRiskAreas}</div>
            <div className="text-xs text-gray-600">High Risk Areas</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">{stats.mediumRiskAreas}</div>
            <div className="text-xs text-gray-600">Medium Risk Areas</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{stats.lowRiskAreas}</div>
            <div className="text-xs text-gray-600">Low Risk Areas</div>
          </div>
        </div>

        {/* Hotspots List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Identified Hotspots</h3>
          <div className="grid gap-3">
            {hotspots.map((hotspot) => (
              <div
                key={hotspot.id}
                onClick={() => setSelectedHotspot(selectedHotspot?.id === hotspot.id ? null : hotspot)}
                className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">
                        Hotspot {Number.parseInt(hotspot.id) + 1} - ({hotspot.latitude.toFixed(4)},{" "}
                        {hotspot.longitude.toFixed(4)})
                      </span>
                      <Badge variant={getRiskBadgeVariant(hotspot.risk_level)}>{hotspot.risk_level} Risk</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {hotspot.crime_count} crime report(s) in this area
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedHotspot?.id === hotspot.id && (
                  <div className="mt-3 pt-3 border-t space-y-2">
                    <p className="text-sm font-medium text-gray-700">Crimes in this area:</p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {hotspot.crimes.map((crime, idx) => (
                        <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                          <div className="font-medium text-gray-900">{crime.title}</div>
                          <div className="text-xs text-gray-600 flex gap-2">
                            <span>Category: {crime.category}</span>
                            <Badge variant="outline" className="text-xs">
                              {crime.priority}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Information */}
        <Alert className="bg-blue-50 border-blue-200">
          <MapPin className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            This analysis uses K-Means clustering algorithm on real crime data to identify geographic hotspots. Click on
            hotspots to view detailed crime information in each area.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
