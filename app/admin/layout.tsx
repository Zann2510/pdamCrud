import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar"
import { AppSidebar } from "../../components/admin-template/sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        // SidebarProvider mengatur state buka/tutup sidebar
        // dan menyediakan context untuk SidebarTrigger
        <SidebarProvider>
            <div className="flex w-full min-h-screen overflow-hidden">
                {/* Sidebar kiri */}
                <AppSidebar />

                {/*
                    ✅ FIX: Tambah flex-1 agar main mengisi SISA ruang setelah sidebar
                    Sebelumnya <main> tidak punya class apapun sehingga
                    konten halaman tidak mengisi lebar layar dengan benar
                    
                    overflow-auto → agar konten yang panjang bisa di-scroll
                    tanpa mempengaruhi sidebar
                */}
                <main className="flex-1 flex flex-col overflow-auto">
                    {/* Tombol toggle sidebar (≡) — muncul di pojok kiri atas konten */}
                    <div className="p-2 border-b">
                        <SidebarTrigger />
                    </div>
                    {/* Konten halaman aktif dari page.tsx */}
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}