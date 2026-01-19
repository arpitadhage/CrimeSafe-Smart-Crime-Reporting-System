import type { CrimeReport, SOSAlert } from "./types"
import { KMeansClustering, type Point } from "./kmeans-clustering"

export interface Hotspot {
  id: string
  latitude: number
  longitude: number
  crime_count: number
  risk_level: "Low" | "Medium" | "High"
  crimes: Array<{
    title: string
    category: string
    priority: string
    latitude?: number
    longitude?: number
  }>
}

export interface HotspotPredictionResult {
  success: boolean
  error?: string
  hotspots: Hotspot[]
  clustered_crimes: Array<CrimeReport & { cluster_id: string }>
  total_clusters: number
  total_crimes: number
}

export class HotspotService {
  /**
   * Predict crime hotspots from crime reports and SOS alerts
   */
  static async predictHotspots(reports: CrimeReport[], sosAlerts: SOSAlert[] = []): Promise<HotspotPredictionResult> {
    try {
      // Prepare crime data for ML model
      const crimeData: Point[] = [
        // Add reports with coordinates
        ...reports
          .filter((report) => report.location.latitude && report.location.longitude)
          .map((report) => ({
            latitude: report.location.latitude!,
            longitude: report.location.longitude!,
            title: report.title,
            category: report.category,
            priority: report.priority,
            address: report.location.address,
          })),
        // Add SOS alerts (they always have coordinates)
        ...sosAlerts.map((alert) => ({
          latitude: alert.location.latitude,
          longitude: alert.location.longitude,
          title: "Emergency SOS Alert",
          category: "emergency",
          priority: "emergency",
          address: alert.location.address || "GPS Coordinates",
        })),
      ]

      if (crimeData.length === 0) {
        return {
          success: true,
          error: "No crime data with coordinates available for analysis",
          hotspots: [],
          clustered_crimes: [],
          total_clusters: 0,
          total_crimes: 0,
        }
      }

      // Run K-Means clustering
      const optimalK = Math.min(5, Math.max(2, Math.ceil(crimeData.length / 3)))
      const clusters = KMeansClustering.cluster(crimeData, optimalK)

      // Convert clusters to hotspots
      const hotspots: Hotspot[] = clusters.map((cluster, index) => ({
        id: `hotspot_${index}`,
        latitude: cluster.centroid.latitude,
        longitude: cluster.centroid.longitude,
        crime_count: cluster.points.length,
        risk_level: cluster.risk_level,
        crimes: cluster.points.map((point) => ({
          title: point.title,
          category: point.category,
          priority: point.priority,
          latitude: point.latitude,
          longitude: point.longitude,
        })),
      }))

      // Map crimes to clusters
      const clustered_crimes: Array<CrimeReport & { cluster_id: string }> = reports
        .filter((report) => report.location.latitude && report.location.longitude)
        .map((report) => {
          const clusterIndex = clusters.findIndex((cluster) =>
            cluster.points.some(
              (p) => p.latitude === report.location.latitude && p.longitude === report.location.longitude,
            ),
          )
          return {
            ...report,
            cluster_id: clusterIndex >= 0 ? `cluster_${clusterIndex}` : "unclustered",
          }
        })

      return {
        success: true,
        hotspots,
        clustered_crimes,
        total_clusters: clusters.length,
        total_crimes: crimeData.length,
      }
    } catch (error) {
      console.error("[HotspotService] Error predicting hotspots:", error)
      return {
        success: false,
        error: `Failed to predict hotspots: ${error instanceof Error ? error.message : String(error)}`,
        hotspots: [],
        clustered_crimes: [],
        total_clusters: 0,
        total_crimes: 0,
      }
    }
  }

  /**
   * Get risk level color for display
   */
  static getRiskLevelColor(riskLevel: string): string {
    switch (riskLevel) {
      case "High":
        return "#dc2626" // red
      case "Medium":
        return "#f59e0b" // orange
      case "Low":
        return "#10b981" // green
      default:
        return "#6b7280" // gray
    }
  }
}
