export interface Point {
  latitude: number
  longitude: number
  title: string
  category: string
  priority: string
  address?: string
}

export interface Cluster {
  id: string
  centroid: { latitude: number; longitude: number }
  points: Point[]
  risk_level: "Low" | "Medium" | "High"
}

export class KMeansClustering {
  /**
   * K-Means clustering algorithm for crime hotspots
   */
  static cluster(points: Point[], k: number, maxIterations = 100): Cluster[] {
    if (points.length === 0) return []
    if (k >= points.length) k = Math.max(1, points.length - 1)

    // Initialize centroids randomly from points
    let centroids = this.initializeCentroids(points, k)
    let clusters: Cluster[] = []

    for (let iteration = 0; iteration < maxIterations; iteration++) {
      // Assign points to nearest centroid
      clusters = this.assignPointsToClusters(points, centroids)

      // Calculate new centroids
      const newCentroids = clusters.map((cluster) => this.calculateCentroid(cluster.points))

      // Check for convergence
      if (this.centroidsConverged(centroids, newCentroids)) {
        break
      }

      centroids = newCentroids
    }

    // Create final clusters with IDs and risk levels
    return clusters.map((cluster, index) => ({
      id: `cluster_${index}`,
      centroid: cluster.centroid,
      points: cluster.points,
      risk_level: this.calculateRiskLevel(cluster.points),
    }))
  }

  private static initializeCentroids(points: Point[], k: number): Array<{ latitude: number; longitude: number }> {
    const centroids: Array<{ latitude: number; longitude: number }> = []
    const indices = new Set<number>()

    while (centroids.length < k) {
      const randomIndex = Math.floor(Math.random() * points.length)
      if (!indices.has(randomIndex)) {
        indices.add(randomIndex)
        centroids.push({
          latitude: points[randomIndex].latitude,
          longitude: points[randomIndex].longitude,
        })
      }
    }

    return centroids
  }

  private static distance(point: Point, centroid: { latitude: number; longitude: number }): number {
    const latDiff = point.latitude - centroid.latitude
    const lonDiff = point.longitude - centroid.longitude
    return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff)
  }

  private static assignPointsToClusters(
    points: Point[],
    centroids: Array<{ latitude: number; longitude: number }>,
  ): Cluster[] {
    const clusters: Cluster[] = centroids.map((centroid, index) => ({
      id: `cluster_${index}`,
      centroid,
      points: [],
      risk_level: "Low",
    }))

    // Assign each point to nearest centroid
    for (const point of points) {
      let minDistance = Number.POSITIVE_INFINITY
      let nearestClusterIndex = 0

      for (let i = 0; i < centroids.length; i++) {
        const dist = this.distance(point, centroids[i])
        if (dist < minDistance) {
          minDistance = dist
          nearestClusterIndex = i
        }
      }

      clusters[nearestClusterIndex].points.push(point)
    }

    return clusters.filter((cluster) => cluster.points.length > 0)
  }

  private static calculateCentroid(points: Point[]): { latitude: number; longitude: number } {
    if (points.length === 0) return { latitude: 0, longitude: 0 }

    const sumLat = points.reduce((sum, p) => sum + p.latitude, 0)
    const sumLon = points.reduce((sum, p) => sum + p.longitude, 0)

    return {
      latitude: sumLat / points.length,
      longitude: sumLon / points.length,
    }
  }

  private static centroidsConverged(
    old: Array<{ latitude: number; longitude: number }>,
    newCentroids: Array<{ latitude: number; longitude: number }>,
  ): boolean {
    const threshold = 0.0001
    return old.every((oldCentroid, index) => {
      const newCentroid = newCentroids[index]
      if (!newCentroid) return false
      const distance = this.distance(
        { latitude: oldCentroid.latitude, longitude: oldCentroid.longitude, title: "", category: "", priority: "" },
        newCentroid,
      )
      return distance < threshold
    })
  }

  private static calculateRiskLevel(points: Point[]): "Low" | "Medium" | "High" {
    if (points.length === 0) return "Low"

    const emergencyCount = points.filter((p) => p.priority === "emergency" || p.priority === "high").length
    const percentage = (emergencyCount / points.length) * 100

    if (percentage > 50) return "High"
    if (percentage > 20) return "Medium"
    return "Low"
  }
}
