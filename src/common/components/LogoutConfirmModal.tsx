
"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/store/api/authApi"; // твой RTK Query

interface Props {
    open: boolean;
    onClose: () => void;
    email: string;
}

export default function LogoutConfirmModal({ open, onClose, email }: Props) {
    const router = useRouter();
    const [logout, { isLoading }] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            onClose();
            router.push("/login"); // редирект на страницу входа
        } catch (e) {
            console.error("Ошибка при logout", e);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Are you really want to log out of your account "{email}"?
                    </DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={handleLogout} disabled={isLoading}>
                        Yes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
