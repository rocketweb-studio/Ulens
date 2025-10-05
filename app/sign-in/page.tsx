import { SignIn } from '@/src/features/auth/ui/SignIn'

export default function SignInPage() {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <SignIn />
    </div>
  )
}
