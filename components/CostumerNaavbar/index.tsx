"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Droplets, Home, User, FileText, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "../../lib/utils"
import { deleteCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

const menuItems = [
    { href: "/costumer/dashboard", label: "Dashboard", icon: Home },
    { href: "/costumer/profile", label: "Profile", icon: User },
    { href: "/costumer/bills", label: "Tagihan", icon: FileText },
]

export default function CustomerNavbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [loggingOut, setLoggingOut] = useState(false)

    const handleLogout = () => {
        setLoggingOut(true)
        deleteCookie("accessToken")
        deleteCookie("userRole")
        router.push("/sign-in")
    }

    return (
        <>
            <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/costumer/dashboard" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-[#0F5B8C] rounded-lg flex items-center justify-center">
                                <Droplets className="w-4.5 h-4.5 text-white" />
                            </div>
                            <span className="font-bold text-gray-900">PDAM</span>
                            <span className="text-xs bg-[#E6F0F9] text-[#0F5B8C] px-2 py-0.5 rounded-full hidden sm:block">
                                Customer
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-1">
                            {menuItems.map(item => {
                                const Icon = item.icon
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                            isActive
                                                ? "bg-[#0F5B8C] text-white"
                                                : "text-gray-600 hover:bg-[#E6F0F9] hover:text-[#0F5B8C]"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Right: Logout + Mobile toggle */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>{loggingOut ? "..." : "Logout"}</span>
                            </button>
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                {mobileOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile dropdown */}
                {mobileOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
                        {menuItems.map(item => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                                        isActive ? "bg-[#0F5B8C] text-white" : "text-gray-600 hover:bg-[#E6F0F9] hover:text-[#0F5B8C]"
                                    )}
                                >
                                    <Icon className="w-4 h-4" /> {item.label}
                                </Link>
                            )
                        })}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 w-full"
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                )}
            </nav>
            {/* Spacer agar konten tidak tertimpa navbar fixed */}
            <div className="h-16" />
        </>
    )
}