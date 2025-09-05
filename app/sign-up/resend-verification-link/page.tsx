'use client'

import { ResendVerification } from '@/src/feature/auth/ui/SignUp/ResendVerification/ResendVerification'
import { FlexContainer } from '@/src/shared/components/FlexContainer'

export default function ResendVerificationLink() {
  return (
    <FlexContainer justify={'center'}>
      <ResendVerification />
    </FlexContainer>
  )
}
