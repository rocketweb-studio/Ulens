import { ResetPassword } from '@/src/feature/auth/ui/PasswordRecovery/ResetPassword'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const { token, email } = await searchParams

  let isValidCode: boolean = false

  try {
    const res = await fetch(`https://ulens.org/api/v1/auth/check-recovery-code`, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: token,
      }),
    })

    if (res.status !== 200) {
      isValidCode = false
    } else {
      isValidCode = true
    }
  } catch (error) {
    console.log(error)
  }

  return (
    <div>
      <ResetPassword isValidCode={isValidCode} recoveryCode={token ? token : ''} email={email ? email : ''} />
    </div>
  )
}
