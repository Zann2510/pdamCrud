"use client"

import { deleteCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut } from "lucide-react"

// Komponen ini bisa dipasang di sidebar atau header manapun
export default function LogoutButton() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        setLoading(true)
        try {
            // Hapus kedua cookie yang dibuat saat login
            // deleteCookie dari cookies-next bekerja di client side
            deleteCookie("accessToken")
            deleteCookie("userRole")

            // Redirect ke halaman sign-in
            // Middleware akan memblokir akses ke /admin/* tanpa cookie
            router.push("/sign-in")
        } catch (error) {
            console.error("Logout error:", error)
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 w-full px-2 py-2 rounded-md text-sm
                       text-red-500 hover:bg-red-50 hover:text-red-600
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <LogOut className="size-4" />
            <span>{loading ? "Logging out..." : "Logout"}</span>
        </button>
    )
}