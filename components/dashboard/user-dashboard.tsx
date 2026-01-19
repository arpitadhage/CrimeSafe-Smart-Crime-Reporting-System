"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, FileText, Plus, Shield, MessageCircle, Users, TrendingUp, Clock } from "lucide-react"
import type { User, CrimeReport } from "@/lib/types"
import { ReportForm } from "@/components/reports/report-form"
import { ReportDetails } from "@/components/reports/report-details"
import { ChatInterface } from "@/components/chat/chat-interface"
import { EmergencyButton } from "@/components/emergency/emergency-button"
import { Logo } from "@/components/ui/logo"
import { DatabaseService } from "@/lib/database"
import { WebSocketService } from "@/lib/websocket"

interface UserDashboardProps {
  user: User
  onLogout: () => void
}

export function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [userReports, setUserReports] = useState<CrimeReport[]>([])
  const [selectedReport, setSelectedReport] = useState<CrimeReport | null>(null)
  const [showReportForm, setShowReportForm] = useState(false)

  useEffect(() => {
    DatabaseService.initializeDatabase()
    const wsService = WebSocketService.getInstance()
    wsService.connect(user.id)

    const loadReports = () => {
      const storedReports = DatabaseService.loadReports()
      const reports = storedReports.filter((report) => report.userId === user.id)
      setUserReports(reports)
    }

    loadReports()
    const interval = setInterval(loadReports, 3000)

    return () => {
      wsService.disconnect()
      clearInterval(interval)
    }
  }, [user.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "investigating":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "resolved":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "closed":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "high":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  if (showReportForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => setShowReportForm(false)}
              className="border-blue-300 text-blue-100 hover:bg-blue-700 bg-transparent"
            >
              ← Back to Dashboard
            </Button>
            <EmergencyButton userId={user.id} />
          </div>
          <ReportForm
            userId={user.id}
            onSubmit={(report) => {
              const allReports = DatabaseService.loadReports()
              const updatedReports = [...allReports, report]
              DatabaseService.saveReports(updatedReports)
              setUserReports((prev) => [...prev, report])
              setShowReportForm(false)
            }}
            onCancel={() => setShowReportForm(false)}
          />
        </div>
      </div>
    )
  }

  if (selectedReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedReport(null)}
              className="border-blue-300 text-blue-100 hover:bg-blue-700 bg-transparent"
            >
              ← Back to Dashboard
            </Button>
            <EmergencyButton userId={user.id} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportDetails report={selectedReport} />
            <ChatInterface reportId={selectedReport.id} currentUser={user} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Logo />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-white">CrimeSafe</h1>
                <p className="text-blue-100 text-sm">National Crime Reporting Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <EmergencyButton userId={user.id} />
              <div className="text-right">
                <span className="text-sm text-blue-100">Welcome,</span>
                <div className="text-white font-medium">{user.name}</div>
              </div>
              <Button
                variant="outline"
                onClick={onLogout}
                className="border-blue-300 text-blue-100 hover:bg-blue-800 bg-transparent"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-700 data-[state=active]:text-white">
              My Reports
            </TabsTrigger>
            <TabsTrigger value="emergency" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Emergency
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white shadow-lg border-l-4 border-l-blue-700 hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Total Reports</CardTitle>
                  <FileText className="h-5 w-5 text-blue-700" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{userReports.length}</div>
                  <p className="text-xs text-gray-500 mt-1">All time reports filed</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-l-4 border-l-orange-500 hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Active Cases</CardTitle>
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    {userReports.filter((r) => r.status === "investigating").length}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Under investigation</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-l-4 border-l-green-600 hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Resolved Cases</CardTitle>
                  <Shield className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {userReports.filter((r) => r.status === "resolved").length}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Successfully resolved</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <AlertTriangle className="h-12 w-12 text-red-100 group-hover:scale-110 transition-transform" />
                    <div className="text-right">
                      <div className="text-2xl font-bold">Emergency</div>
                      <div className="text-red-100 text-sm">Immediate Response</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">EMERGENCY CRIMES</h3>
                  <p className="text-red-100 text-sm">
                    Life threatening situations requiring immediate police response
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="h-12 w-12 text-blue-100 group-hover:scale-110 transition-transform" />
                    <div className="text-right">
                      <div className="text-2xl font-bold">General</div>
                      <div className="text-blue-100 text-sm">Standard Processing</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">GENERAL CRIMES</h3>
                  <p className="text-blue-100 text-sm">Theft, fraud, and other criminal activities</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Shield className="h-12 w-12 text-purple-100 group-hover:scale-110 transition-transform" />
                    <div className="text-right">
                      <div className="text-2xl font-bold">Cyber</div>
                      <div className="text-purple-100 text-sm">Digital Crimes</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">CYBER CRIMES</h3>
                  <p className="text-purple-100 text-sm">Online fraud, hacking, and digital harassment</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-700" />
                  Quick Actions
                </CardTitle>
                <CardDescription>File reports and access emergency services</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Button
                  onClick={() => setShowReportForm(true)}
                  className="h-24 flex-col gap-3 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 shadow-lg text-lg"
                >
                  <Plus className="h-8 w-8" />
                  File New Report
                </Button>
                <div className="h-24">
                  <EmergencyButton size="lg" userId={user.id} />
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-700" />
                  Recent Reports
                </CardTitle>
                <CardDescription>Your latest crime reports and their status</CardDescription>
              </CardHeader>
              <CardContent>
                {userReports.length === 0 ? (
                  <div className="text-center py-16">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No Reports Filed</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Start by filing your first crime report. Our system ensures secure and confidential reporting.
                    </p>
                    <Button
                      onClick={() => setShowReportForm(true)}
                      className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 shadow-lg"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      File Your First Report
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userReports.slice(0, 3).map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-6 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{report.title}</h3>
                          <p className="text-gray-600 mt-1">{report.location.address}</p>
                          <p className="text-sm text-gray-500 mt-1">{report.createdAt.toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-3">
                          <Badge className={`border ${getPriorityColor(report.priority)} px-3 py-1`}>
                            {report.priority}
                          </Badge>
                          <Badge className={`border ${getStatusColor(report.status)} px-3 py-1`}>{report.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Reports</h2>
              <Button
                onClick={() => setShowReportForm(true)}
                className="shadow-lg bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </div>

            {userReports.length === 0 ? (
              <Card className="bg-white shadow-lg border-l-4 border-l-blue-700">
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2 text-gray-900">No Reports Yet</h3>
                  <p className="text-gray-500 mb-4">
                    You haven't filed any reports yet. Start by creating your first report.
                  </p>
                  <Button
                    onClick={() => setShowReportForm(true)}
                    className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    File Your First Report
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {userReports.map((report) => (
                  <Card
                    key={report.id}
                    className="bg-white shadow-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <CardContent className="p-6" onClick={() => setSelectedReport(report)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium mb-2 text-gray-900">{report.title}</h3>
                          <p className="text-gray-600 mb-2 line-clamp-2">{report.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{report.location.address}</span>
                            <span>{report.dateTime.toLocaleDateString()}</span>
                            {report.assignedOfficer && (
                              <span className="flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                Assigned to Officer
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <Badge className={`border ${getPriorityColor(report.priority)} px-3 py-1`}>
                            {report.priority}
                          </Badge>
                          <Badge className={`border ${getStatusColor(report.status)} px-3 py-1`}>{report.status}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs hover:bg-primary/10"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedReport(report)
                            }}
                          >
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="emergency" className="space-y-6">
            <Card className="bg-white shadow-lg border-l-4 border-l-red-600">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  Emergency Services
                </CardTitle>
                <CardDescription>Use these options only in case of immediate danger or emergency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-full max-w-md">
                    <EmergencyButton size="lg" userId={user.id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
