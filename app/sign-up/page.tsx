'use client'

import { SignUp } from '@/src/features/auth/ui/SignUp'
import { FlexContainer } from '@/src/shared/components/FlexContainer'

export default function SingUpPage() {
  return (
      <FlexContainer justify={'center'} align={'center'} style={{ minHeight: 'calc(100vh - 60px)' }}>
          <SignUp />
      </FlexContainer>
  )
}
