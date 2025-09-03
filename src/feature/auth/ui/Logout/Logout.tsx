"use client"

import { useEffect, useState } from "react"
import { ConfirmLogout } from "@/src/feature/auth/ui/Logout/ConfirmLogout"
import styles from "@/src/feature/auth/ui/SignIn/SignIn.module.scss"
import { useGetMeQuery } from "@/src/feature/auth/api/authApi"
import { useRouter } from "next/navigation"
import {Path} from "@/src/common/components/Navigation/Navigation";

export const Logout = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { data, isLoading, isError, error } = useGetMeQuery()
    const router = useRouter()

    useEffect(() => {
        if (isError) {
            const status = (error as any)?.status
            if (status === 401) {
                router.push(Path.SignIn)
            }
        }
    }, [isError, error, router])

    if (isLoading) {
        return (
            <button disabled className={styles.submitBtn}>
                Loading...
            </button>
        )
    }

    const email = data?.email ?? "email"

    return (
        <>
            <button
                className={styles.submitBtn}
                onClick={() => {
                    setIsModalOpen(true)
                }}
            >
                Log out
            </button>
            <ConfirmLogout
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                email={email}
            />
        </>
    )
}