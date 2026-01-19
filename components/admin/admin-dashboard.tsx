"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, FileText, MessageSquare, MapPin, Siren } from "lucide-react"
import type { User, CrimeReport, SOSAlert, ChatMessage } from "@/lib/types"
import { Logo } from "@/components/ui/logo"
import { DatabaseService } from "@/lib/database"
import { ChatInterface } from "@/components/chat/chat-interface"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { PoliceManagement } from "@/components/admin/police-management"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EvidenceViewer } from "@/components/reports/evidence-viewer"

interface AdminDashboardProps {
  user: User
  onLogout: () => void
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [reports, setReports] = useState<CrimeReport[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selectedReport, setSelectedReport] = useState<CrimeReport | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  useEffect(() => {
    DatabaseService.initializeDatabase()

    const loadData = () => {
      const storedReports = DatabaseService.loadReports()
      const storedUsers = DatabaseService.loadUsers()
      const storedSOSAlerts = DatabaseService.loadSOSAlerts()
      const storedMessages = DatabaseService.loadMessages()

      setReports(storedReports)
      setUsers(storedUsers)
      setSosAlerts(storedSOSAlerts)
      setMessages(storedMessages)
    }

    loadData()

    const interval = setInterval(loadData, 3000)
    return () => clearInterval(interval)
  }, [])

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesPriority = priorityFilter === "all" || report.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "investigating":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const updateReportStatus = (reportId: string, newStatus: string) => {
    const updatedReports = reports.map((report) =>
      report.id === reportId ? { ...report, status: newStatus as any, updatedAt: new Date() } : report,
    )
    setReports(updatedReports)
    DatabaseService.saveReports(updatedReports)
  }

  const assignOfficer = (reportId: string, officerId: string) => {
    const updatedReports = reports.map((report) =>
      report.id === reportId ? { ...report, assignedOfficer: officerId, updatedAt: new Date() } : report,
    )
    setReports(updatedReports)
    DatabaseService.saveReports(updatedReports)
  }

  const respondToSOS = (alertId: string) => {
    const updatedAlerts = sosAlerts.map((alert) =>
      alert.id === alertId ? { ...alert, status: "responded" as const, responderId: user.id } : alert,
    )
    setSosAlerts(updatedAlerts)
    DatabaseService.saveSOSAlerts(updatedAlerts)
  }

  const stats = {
    totalReports: reports.length,
    pendingReports: reports.filter((r) => r.status === "pending").length,
    activeInvestigations: reports.filter((r) => r.status === "investigating").length,
    resolvedCases: reports.filter((r) => r.status === "resolved").length,
    emergencyReports: reports.filter((r) => r.priority === "emergency").length,
    totalUsers: users.filter((u) => u.role === "citizen").length,
    totalOfficers: users.filter((u) => u.role === "officer").length,
    activeSOS: sosAlerts.filter((s) => s.status === "active").length,
    totalMessages: messages.length,
  }

  const isAdmin = user.role === "admin"

  if (selectedReport) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card/50 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Logo />
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  POLICE DASHBOARD
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setSelectedReport(null)}>
                  ← Back to Dashboard
                </Button>
                <Button variant="outline" onClick={onLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Report Details</CardTitle>
                <CardDescription>Case #{selectedReport.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground">{selectedReport.title}</h3>
                  <p className="text-muted-foreground mt-1">{selectedReport.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p className="text-foreground">{selectedReport.location.address}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <p className="text-foreground">{selectedReport.dateTime.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Priority:</span>
                    <Badge className={getPriorityColor(selectedReport.priority)}>{selectedReport.priority}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={getStatusColor(selectedReport.status)}>{selectedReport.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ChatInterface reportId={selectedReport.id} currentUser={user} />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Logo />
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                POLICE DASHBOARD
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              {stats.activeSOS > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  <Siren className="h-3 w-3 mr-1" />
                  {stats.activeSOS} Active SOS
                </Badge>
              )}
              <Badge variant="secondary">{user.role.toUpperCase()}</Badge>
              <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
              <Button variant="outline" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="sos" className={stats.activeSOS > 0 ? "text-red-400" : ""}>
              SOS Alerts {stats.activeSOS > 0 && `(${stats.activeSOS})`}
            </TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            {isAdmin && <TabsTrigger value="police">Police</TabsTrigger>}
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Total Reports</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stats.totalReports}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Active SOS</CardTitle>
                  <Siren className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">{stats.activeSOS}</div>
                  <p className="text-xs text-muted-foreground">Requiring immediate response</p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Active Cases</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">{stats.activeInvestigations}</div>
                  <p className="text-xs text-muted-foreground">Under investigation</p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{stats.totalMessages}</div>
                  <p className="text-xs text-muted-foreground">Total communications</p>
                </CardContent>
              </Card>
            </div>

            {/* SOS Alerts section */}
            {sosAlerts.length > 0 && (
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <Siren className="h-5 w-5" />
                    Emergency SOS Alerts
                  </CardTitle>
                  <CardDescription>Immediate response required</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sosAlerts
                      .filter((alert) => alert.status === "active")
                      .map((alert) => (
                        <div
                          key={alert.id}
                          className="flex items-center justify-between p-4 border border-red-500/50 bg-red-500/10 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-red-400" />
                              <span className="font-medium text-red-300">Emergency Alert</span>
                              <Badge variant="destructive" className="animate-pulse">
                                ACTIVE
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Location:{" "}
                              {alert.location.address || `${alert.location.latitude}, ${alert.location.longitude}`}
                            </p>
                            <p className="text-xs text-muted-foreground">Time: {alert.timestamp.toLocaleString()}</p>
                          </div>
                          <Button
                            variant="destructive"
                            onClick={() => respondToSOS(alert.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Respond
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* SOS Alerts tab */}
          <TabsContent value="sos" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <Siren className="h-5 w-5" />
                  SOS Emergency Alerts
                </CardTitle>
                <CardDescription>Monitor and respond to emergency situations</CardDescription>
              </CardHeader>
              <CardContent>
                {sosAlerts.length === 0 ? (
                  <div className="text-center py-12">
                    <Siren className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No SOS alerts at this time</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sosAlerts.map((alert) => (
                      <Card
                        key={alert.id}
                        className={`${alert.status === "active" ? "border-red-500/50 bg-red-500/10" : "bg-card/30"}`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <MapPin className="h-4 w-4 text-red-400" />
                                <span className="font-medium text-foreground">Emergency Alert #{alert.id}</span>
                                <Badge
                                  variant={alert.status === "active" ? "destructive" : "secondary"}
                                  className={alert.status === "active" ? "animate-pulse" : ""}
                                >
                                  {alert.status.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="space-y-1 text-sm">
                                <p className="text-muted-foreground">
                                  <strong>Location:</strong>{" "}
                                  {alert.location.address || `${alert.location.latitude}, ${alert.location.longitude}`}
                                </p>
                                <p className="text-muted-foreground">
                                  <strong>Time:</strong> {alert.timestamp.toLocaleString()}
                                </p>
                                {alert.responderId && (
                                  <p className="text-muted-foreground">
                                    <strong>Responder:</strong>{" "}
                                    {users.find((u) => u.id === alert.responderId)?.name || "Unknown"}
                                  </p>
                                )}
                              </div>
                            </div>
                            {alert.status === "active" && (
                              <Button
                                variant="destructive"
                                onClick={() => respondToSOS(alert.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Respond Now
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Management</CardTitle>
                <CardDescription>View and manage all crime reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-input/50 border-border/50">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-40 bg-input/50 border-border/50">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reports Table */}
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <Card key={report.id} className="bg-card/30 border-border/50 hover:bg-card/50 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium mb-2 text-foreground">{report.title}</h3>
                            <p className="text-muted-foreground mb-2 line-clamp-2">{report.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>ID: {report.id}</span>
                              <span>{report.location.address}</span>
                              <span>{report.createdAt.toLocaleDateString()}</span>
                              {report.evidence.length > 0 && (
                                <Badge variant="outline" className="text-blue-400 border-blue-400/50">
                                  {report.evidence.length} Evidence File{report.evidence.length !== 1 ? "s" : ""}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <Badge className={getPriorityColor(report.priority)}>{report.priority}</Badge>
                            <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Select value={report.status} onValueChange={(value) => updateReportStatus(report.id, value)}>
                            <SelectTrigger className="w-40 bg-input/50 border-border/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="investigating">Investigating</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select
                            value={report.assignedOfficer || ""}
                            onValueChange={(value) => assignOfficer(report.id, value)}
                          >
                            <SelectTrigger className="w-48 bg-input/50 border-border/50">
                              <SelectValue placeholder="Assign Officer" />
                            </SelectTrigger>
                            <SelectContent>
                              {users
                                .filter((u) => u.role === "officer")
                                .map((officer) => (
                                  <SelectItem key={officer.id} value={officer.id}>
                                    {officer.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>

                          {report.evidence.length > 0 && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="border-border/50 hover:bg-primary/10 bg-transparent"
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  View Evidence ({report.evidence.length})
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                                <DialogHeader>
                                  <DialogTitle>Evidence - Case #{report.id}</DialogTitle>
                                  <DialogDescription>{report.title}</DialogDescription>
                                </DialogHeader>
                                <div className="mt-4">
                                  <EvidenceViewer evidence={report.evidence} />
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}

                          <Button
                            variant="outline"
                            onClick={() => setSelectedReport(report)}
                            className="border-border/50 hover:bg-primary/10"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>{isAdmin ? "Manage all system users" : "View system users"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users
                    .filter((user) => (isAdmin ? true : user.role === "citizen"))
                    .map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">Joined {user.createdAt.toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant={user.isVerified ? "default" : "secondary"}>
                            {user.isVerified ? "Verified" : "Unverified"}
                          </Badge>
                          <Badge variant="outline">{user.role}</Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="police" className="space-y-6">
              <PoliceManagement
                users={users}
                onUsersUpdate={(updatedUsers) => setUsers(updatedUsers)}
                currentUser={user}
              />
            </TabsContent>
          )}

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
