"use client"

import { SidebarTrigger } from "../../components/ui/sidebar"

// Topbar dipisah jadi Client Component tersendiri
// agar AdminLayout (Server Component) tidak perlu jadi client
export function AdminTopbar() {
    return (
        <div className="h-12 flex items-center px-4 bg-white border-b border-gray-100 sticky top-0 z-30 shrink-0">
            <SidebarTrigger className="text-gray-500 hover:text-[#0F5B8C] hover:bg-[#E6F0F9]" />
            <div className="w-px h-5 bg-gray-200 mx-3" />
            <span className="text-sm text-gray-400">PDAM Admin Panel</span>
        </div>
    )
}