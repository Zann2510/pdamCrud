"use client"

import { deleteCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut } from "lucide-react"
import { cn } from "../../lib/utils"

export default function LogoutButton() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        setLoading(true)
        try {
            deleteCookie("accessToken")
            deleteCookie("userRole")
            router.push("/sign-in")
        } catch (error) {
            console.error("Logout error:", error)
            setLoading(false)
        }
    }

    return (
        // ✅ BUG FIX: Tambahkan onClick={handleLogout} yang sebelumnya hilang
        <button
            onClick={handleLogout}
            disabled={loading}
            className={cn(
                "flex items-center gap-2 w-full px-2 py-2 rounded-md text-sm",
                "text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            )}
        >
            <LogOut className="size-4" />
            <span>{loading ? "Logging out..." : "Logout"}</span>
        </button>
    )
}