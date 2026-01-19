"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Users, Clock } from "lucide-react"
import { DatabaseService } from "@/lib/database"
import { CrimeHotspotMap } from "./crime-hotspot-map"

interface AnalyticsData {
  period: string
  totalReports: number
  resolvedReports: number
  pendingReports: number
  emergencyAlerts: number
  responseTime: number
}

export function AnalyticsDashboard() {
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "year">("week")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([])
  const [stats, setStats] = useState({
    totalReports: 0,
    resolvedPercentage: 0,
    avgResponseTime: 0,
    activeEmergencies: 0,
    weeklyChange: 0,
    monthlyChange: 0,
  })

  useEffect(() => {
    loadAnalyticsData()
  }, [timeFilter])

  const loadAnalyticsData = () => {
    const reports = DatabaseService.loadReports()
    const messages = DatabaseService.loadMessages()

    // Generate mock analytics data based on time filter
    const generateData = () => {
      const now = new Date()
      const data: AnalyticsData[] = []

      if (timeFilter === "week") {
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now)
          date.setDate(date.getDate() - i)
          data.push({
            period: date.toLocaleDateString("en-US", { weekday: "short" }),
            totalReports: Math.floor(Math.random() * 20) + 5,
            resolvedReports: Math.floor(Math.random() * 15) + 3,
            pendingReports: Math.floor(Math.random() * 8) + 1,
            emergencyAlerts: Math.floor(Math.random() * 5),
            responseTime: Math.floor(Math.random() * 30) + 10,
          })
        }
      } else if (timeFilter === "month") {
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now)
          date.setDate(date.getDate() - i)
          if (i % 5 === 0) {
            // Show every 5th day
            data.push({
              period: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              totalReports: Math.floor(Math.random() * 50) + 20,
              resolvedReports: Math.floor(Math.random() * 40) + 15,
              pendingReports: Math.floor(Math.random() * 15) + 5,
              emergencyAlerts: Math.floor(Math.random() * 10) + 2,
              responseTime: Math.floor(Math.random() * 45) + 15,
            })
          }
        }
      } else {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        months.forEach((month) => {
          data.push({
            period: month,
            totalReports: Math.floor(Math.random() * 200) + 100,
            resolvedReports: Math.floor(Math.random() * 180) + 80,
            pendingReports: Math.floor(Math.random() * 50) + 20,
            emergencyAlerts: Math.floor(Math.random() * 30) + 10,
            responseTime: Math.floor(Math.random() * 60) + 20,
          })
        })
      }

      return data
    }

    const data = generateData()
    setAnalyticsData(data)

    // Calculate stats
    const totalReports = reports.length
    const resolvedReports = reports.filter((r) => r.status === "resolved").length
    const resolvedPercentage = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0
    const avgResponseTime = Math.floor(Math.random() * 45) + 15
    const activeEmergencies = DatabaseService.loadSOSAlerts().filter((alert) => alert.status === "active").length

    setStats({
      totalReports,
      resolvedPercentage,
      avgResponseTime,
      activeEmergencies,
      weeklyChange: Math.floor(Math.random() * 20) - 10, // -10 to +10
      monthlyChange: Math.floor(Math.random() * 30) - 15, // -15 to +15
    })
  }

  const chartConfig = {
    totalReports: {
      label: "Total Reports",
      color: "hsl(var(--chart-1))",
    },
    resolvedReports: {
      label: "Resolved Reports",
      color: "hsl(var(--chart-2))",
    },
    emergencyAlerts: {
      label: "Emergency Alerts",
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Overview</h2>
          <p className="text-muted-foreground">Crime reporting statistics and trends</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeFilter === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter("week")}
          >
            Week
          </Button>
          <Button
            variant={timeFilter === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter("month")}
          >
            Month
          </Button>
          <Button
            variant={timeFilter === "year" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter("year")}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.weeklyChange >= 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              {Math.abs(stats.weeklyChange)}% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolvedPercentage}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.monthlyChange >= 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              {Math.abs(stats.monthlyChange)}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}m</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
              5m faster than average
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Emergencies</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.activeEmergencies}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Badge variant="destructive" className="text-xs">
                Requires Attention
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hotspot Analysis Section */}
      <CrimeHotspotMap />

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Reports Trend</CardTitle>
            <CardDescription>Total and resolved reports over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="totalReports"
                    stroke="var(--color-totalReports)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-totalReports)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolvedReports"
                    stroke="var(--color-resolvedReports)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-resolvedReports)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Alerts</CardTitle>
            <CardDescription>Emergency alerts and response times</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="emergencyAlerts" fill="var(--color-emergencyAlerts)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
