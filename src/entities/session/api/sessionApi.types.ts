export type DeviceSession = {
  deviceId: string
  ip: string
  country: string
  city: string
  latitude: number
  longitude: number
  timezone: string
  browser: string
  os: string
  type: string
  createdAt: string
}

export type UserSessions = {
  currentSession: DeviceSession
  otherSessions: DeviceSession[]
}

export type SessionsData = UserSessions[]
