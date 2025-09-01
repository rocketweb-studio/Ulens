import {useState} from "react";
import {ConfirmLogoutModal} from "@/src/feature/auth/ui/logout/ConfirmLogoutModal";
import styles from "@/src/feature/auth/ui/SignIn/SignIn.module.scss";


export const Logout = ({ email }: { email: string }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <button className={styles.submitBtn} onClick={() => setIsModalOpen(true)}>Log out</button>
            <ConfirmLogoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                email={email}
            />
        </>
    )
}

