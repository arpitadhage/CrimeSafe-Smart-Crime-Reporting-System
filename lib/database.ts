import type { User, CrimeReport, ChatMessage, EmergencyContact, SOSAlert } from "./types"

export class DatabaseService {
  private static readonly STORAGE_KEYS = {
    USERS: "crimesafe_users",
    REPORTS: "crimesafe_reports",
    MESSAGES: "crimesafe_messages",
    EMERGENCY_CONTACTS: "crimesafe_emergency_contacts",
    SOS_ALERTS: "crimesafe_sos_alerts",
  }

  // Generic storage methods
  static save<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
    }
  }

  static load<T>(key: string, defaultData: T[] = []): T[] {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultData
    } catch (error) {
      console.error("Failed to load from localStorage:", error)
      return defaultData
    }
  }

  private static deserializeDates(obj: any, dateFields: string[]): any {
    const result = { ...obj }
    dateFields.forEach((field) => {
      if (result[field] && typeof result[field] === "string") {
        result[field] = new Date(result[field])
      }
    })
    return result
  }

  private static deserializeReportDates(report: any): CrimeReport {
    const deserializedReport = this.deserializeDates(report, ["dateTime", "createdAt", "updatedAt"])

    // Handle evidence array dates
    if (deserializedReport.evidence && Array.isArray(deserializedReport.evidence)) {
      deserializedReport.evidence = deserializedReport.evidence.map((evidence: any) =>
        this.deserializeDates(evidence, ["uploadedAt"]),
      )
    }

    return deserializedReport
  }

  private static deserializeMessageDates(message: any): ChatMessage {
    return this.deserializeDates(message, ["timestamp"])
  }

  private static deserializeUserDates(user: any): User {
    return this.deserializeDates(user, ["createdAt"])
  }

  // User operations
  static saveUsers(users: User[]): void {
    this.save(this.STORAGE_KEYS.USERS, users)
  }

  static loadUsers(): User[] {
    const users = this.load(this.STORAGE_KEYS.USERS, [])
    return users.map((user) => this.deserializeUserDates(user))
  }

  // Report operations
  static saveReports(reports: CrimeReport[]): void {
    this.save(this.STORAGE_KEYS.REPORTS, reports)
  }

  static loadReports(): CrimeReport[] {
    const reports = this.load(this.STORAGE_KEYS.REPORTS, [])
    return reports.map((report) => this.deserializeReportDates(report))
  }

  // Message operations
  static saveMessages(messages: ChatMessage[]): void {
    this.save(this.STORAGE_KEYS.MESSAGES, messages)
  }

  static loadMessages(): ChatMessage[] {
    const messages = this.load(this.STORAGE_KEYS.MESSAGES, [])
    return messages.map((message) => this.deserializeMessageDates(message))
  }

  static addMessage(message: ChatMessage): void {
    const messages = this.loadMessages()
    messages.push(message)
    this.saveMessages(messages)
  }

  static getMessagesByReportId(reportId: string): ChatMessage[] {
    const messages = this.loadMessages()
    return messages.filter((msg) => msg.reportId === reportId)
  }

  // Emergency contact operations
  static saveEmergencyContacts(contacts: EmergencyContact[]): void {
    this.save(this.STORAGE_KEYS.EMERGENCY_CONTACTS, contacts)
  }

  static loadEmergencyContacts(): EmergencyContact[] {
    return this.load(this.STORAGE_KEYS.EMERGENCY_CONTACTS, [])
  }

  // SOS alert operations
  static saveSOSAlerts(alerts: SOSAlert[]): void {
    this.save(this.STORAGE_KEYS.SOS_ALERTS, alerts)
  }

  static loadSOSAlerts(): SOSAlert[] {
    const alerts = this.load(this.STORAGE_KEYS.SOS_ALERTS, [])
    return alerts.map((alert) => this.deserializeDates(alert, ["timestamp"]))
  }

  static addSOSAlert(alert: SOSAlert): void {
    const alerts = this.loadSOSAlerts()
    alerts.push(alert)
    this.saveSOSAlerts(alerts)
  }

  // Initialize database with mock data if empty
  static initializeDatabase(): void {
    if (this.loadUsers().length === 0) {
      // Import and save initial mock data
      import("./mock-data").then(({ mockUsers, mockReports, mockMessages, mockEmergencyContacts }) => {
        this.saveUsers(mockUsers)
        this.saveReports(mockReports)
        this.saveMessages(mockMessages)
        this.saveEmergencyContacts(mockEmergencyContacts)
        this.saveSOSAlerts([])
      })
    }
  }
}
