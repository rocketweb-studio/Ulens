import { redirect } from 'next/navigation'

export default async function Verify({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const { token } = await searchParams

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/registration-confirmation`, {
    method: 'post',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: token,
    }),
  })

  if (response.status === 400) {
    redirect('/sign-up/resend-verification-link')
  } else if (response.status === 204) {
    redirect('/sign-up/confirmed-email')
  } else {
    return <div>Please try again</div>
  }
}
