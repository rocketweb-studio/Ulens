import {redirect} from "next/navigation";

export default async function Verify({searchParams}:{searchParams:{ [key: string]: string | undefined }}) {
    const {token} = await searchParams

    try {
        const response = await fetch("https://ulens.org/api/v1/auth/registration-confirmation", {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: token,
            })
        })

        if (response.status === 204) redirect("/sign-up/confirmed-email")
        if (response.status === 400) redirect("/sign-up/resend-verification-link")

    } catch (error) {

    }
    return (
        <div>
        </div>
    )
}
