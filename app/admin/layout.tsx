import { SidebarProvider } from "../../components/ui/sidebar"
import { AppSidebar } from "../../components/admin-template/sidebar"
import { AdminTopbar } from "../../components/admin-template/topbar"
import { cookies } from "next/headers"

// Baca cookie sidebar state di server agar tidak mismatch dengan client
// Ini adalah pola resmi dari shadcn untuk menghindari hydration error
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false"

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <div className="flex w-full min-h-screen overflow-hidden bg-gray-50">
                <AppSidebar/>
                <main className="flex-1 flex flex-col overflow-auto min-w-0">
                    <AdminTopbar />
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}