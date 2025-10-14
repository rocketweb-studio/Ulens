'use client'

import { FlexContainer } from 'src/shared/ui/FlexContainer'
import { PrivacyPolicy } from '@/src/views/privacyPolicy'

export default function PrivacyPolicyPage() {
  return (
    <FlexContainer justify={'center'}>
      <PrivacyPolicy />
    </FlexContainer>
  )
}
