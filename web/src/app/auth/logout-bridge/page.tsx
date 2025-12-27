"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { logout } from "@/lib/user";
import { Suspense } from "react";

function LogoutLogic() {
    const searchParams = useSearchParams();
    const next = searchParams.get("next") || "/";

    useEffect(() => {
        const doLogout = async () => {
            try {
                await logout();
            } catch (e) {
                console.error("Logout failed", e);
            } finally {
                if (next && next.startsWith("http")) {
                    window.location.href = next;
                } else {
                    window.location.href = "/";
                }
            }
        };
        doLogout();
    }, [next]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="text-xl">Logging out Cellilox agents...</div>
        </div>
    );
}

export default function LogoutBridge() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LogoutLogic />
        </Suspense>
    );
}
