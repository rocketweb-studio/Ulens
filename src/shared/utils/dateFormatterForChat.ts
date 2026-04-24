export const dateFormatterForChat = (dateString: string): string => {
  const date: Date = new Date(dateString)
  const now: Date = new Date()

  const diffMs: number = now.getTime() - date.getTime()
  const diffDays: number = diffMs / (1000 * 60 * 60 * 24)

  if (diffDays < 1) {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    }).format(date)
  }

  if (diffDays < 7) {
    const weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return weekDays[date.getUTCDay()]
  }

  const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day: number = date.getUTCDate()
  const month: string = months[date.getUTCMonth()]

  return `${day} ${month}`
}
