'use client'

import { ResendVerification } from '@/src/features/auth/singUp/ui/ResendVerification/ResendVerification'
import { FlexContainer } from 'src/shared/ui/FlexContainer'

export default function ResendVerificationLink() {
  return (
    <FlexContainer justify={'center'}>
      <ResendVerification />
    </FlexContainer>
  )
}
