"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import LogoutConfirmModal from "./LogoutConfirmModal";

export default function Sidebar({ email }: { email: string }) {
    const [open, setOpen] = useState(false);

    return (
        <aside className="p-4 border-r h-full flex flex-col justify-between">
            {/* ...другие пункты меню */}

            <Button variant="destructive" onClick={() => setOpen(true)}>
                Log out
            </Button>

            <LogoutConfirmModal
                open={open}
                onClose={() => setOpen(false)}
                email={email}
            />
        </aside>
    );
}
