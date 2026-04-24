type DeviceType =
  | ''
  | 'desktop'
  | 'smartphone'
  | 'tablet'
  | 'television'
  | 'smart display'
  | 'camera'
  | 'car'
  | 'console'
  | 'portable media player'
  | 'phablet'
  | 'wearable'
  | 'smart speaker'
  | 'feature phone'
  | 'peripheral'

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
  type: DeviceType
  createdAt: string
}

export type UserSessions = {
  currentSession: DeviceSession
  otherSessions: DeviceSession[]
}

export type SessionsData = UserSessions[]
