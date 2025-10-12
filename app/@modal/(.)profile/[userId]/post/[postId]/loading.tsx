'use client'

import { AppLoader } from '@/src/shared/ui/AppLoader/AppLoader'

export default function Loading() {
  return <AppLoader forceMode={true} bg={'rgba(0, 0, 0, 0.8)'} />
}
