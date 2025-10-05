'use client'

import { ConfirmedEmail } from '@/src/features/auth/singUp/ui/ConfirmedEmail/ConfirmedEmail'
import { FlexContainer } from 'src/shared/ui/FlexContainer'

export default function ConfirmedEmailPage() {
  return (
    <FlexContainer justify={'center'}>
      <ConfirmedEmail />
    </FlexContainer>
  )
}
