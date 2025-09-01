import {useState} from "react";
import {ConfirmLogoutModal} from "@/src/feature/auth/ui/logout/ConfirmLogoutModal";


export const Logout = ({ email }: { email: string }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <button onClick={() => setIsModalOpen(true)}>Log out</button>
            <ConfirmLogoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                email={email}
            />
        </>
    )
}

