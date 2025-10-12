export const formatDate = (dateString: string, locale = 'en-US'): string => {
  if (!dateString) return ''

  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString))
}
