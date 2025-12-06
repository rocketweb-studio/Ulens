'use client'

import { SignUp } from '@/src/features/auth/singUp'
import { FlexContainer } from 'src/shared/ui/FlexContainer'

export default function SingUpPage() {
  return (
    <FlexContainer justify={'center'} align={'center'} style={{ minHeight: 'calc(100vh - 60px)' }}>
      <SignUp />
    </FlexContainer>
  )
}
