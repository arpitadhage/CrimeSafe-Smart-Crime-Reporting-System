"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, Shield, Trash2, Edit, AlertCircle } from "lucide-react"
import type { User } from "@/lib/types"
import { AuthService } from "@/lib/auth"
import { DatabaseService } from "@/lib/database"

interface PoliceManagementProps {
  users: User[]
  onUsersUpdate: (users: User[]) => void
  currentUser: User
}

export function PoliceManagement({ users, onUsersUpdate, currentUser }: PoliceManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [newOfficer, setNewOfficer] = useState({
    name: "",
    email: "",
    phone: "",
    rank: "constable",
  })

  if (!AuthService.canManagePolice(currentUser)) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Access Restricted</h3>
            <p className="text-muted-foreground">
              Only administrators can manage police officers and their system access.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const policeOfficers = users.filter((user) => user.role === "officer")

  const handleAddOfficer = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const officerData = {
        name: newOfficer.name,
        email: newOfficer.email,
        phone: newOfficer.phone,
      }

      const newUser = await AuthService.createOfficer(officerData)
      const updatedUsers = [...users, newUser]

      onUsersUpdate(updatedUsers)

      // Reset form
      setNewOfficer({ name: "", email: "", phone: "", rank: "constable" })
      setIsAddDialogOpen(false)
    } catch (err) {
      setError("Failed to add police officer. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveOfficer = (officerId: string) => {
    const updatedUsers = users.filter((user) => user.id !== officerId)
    DatabaseService.saveUsers(updatedUsers)
    onUsersUpdate(updatedUsers)
  }

  const getRankBadgeColor = (rank: string) => {
    switch (rank) {
      case "inspector":
        return "bg-purple-100 text-purple-800"
      case "sergeant":
        return "bg-blue-100 text-blue-800"
      case "constable":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Shield className="h-5 w-5 text-blue-400" />
              Police Officer Management
            </CardTitle>
            <CardDescription>Manage police officers and their access to the system (Admin Only)</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Officer
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Add New Police Officer</DialogTitle>
                <DialogDescription>Create a new police officer account with system access</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddOfficer} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="officer-name">Full Name</Label>
                  <Input
                    id="officer-name"
                    value={newOfficer.name}
                    onChange={(e) => setNewOfficer((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter officer's full name"
                    required
                    className="bg-input/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officer-email">Email Address</Label>
                  <Input
                    id="officer-email"
                    type="email"
                    value={newOfficer.email}
                    onChange={(e) => setNewOfficer((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="officer@police.gov"
                    required
                    className="bg-input/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officer-phone">Phone Number</Label>
                  <Input
                    id="officer-phone"
                    value={newOfficer.phone}
                    onChange={(e) => setNewOfficer((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX"
                    required
                    className="bg-input/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officer-rank">Rank</Label>
                  <Select
                    value={newOfficer.rank}
                    onValueChange={(value) => setNewOfficer((prev) => ({ ...prev, rank: value }))}
                  >
                    <SelectTrigger className="bg-input/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="constable">Constable</SelectItem>
                      <SelectItem value="sergeant">Sergeant</SelectItem>
                      <SelectItem value="inspector">Inspector</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? "Adding Officer..." : "Add Officer"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {policeOfficers.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No police officers added yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add officers to manage crime reports</p>
          </div>
        ) : (
          <div className="space-y-4">
            {policeOfficers.map((officer) => (
              <Card key={officer.id} className="bg-card/30 border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-foreground">{officer.name}</h3>
                        <Badge className={getRankBadgeColor("constable")}>Officer</Badge>
                        <Badge variant={officer.isVerified ? "default" : "secondary"}>
                          {officer.isVerified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>
                          <strong>Email:</strong> {officer.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {officer.phone}
                        </p>
                        <p>
                          <strong>Joined:</strong> {officer.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border/50 hover:bg-primary/10 bg-transparent"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveOfficer(officer.id)}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
