import { Admin } from "../../types"
import { getCookies } from "../../../lib/server-cookies"

import Pagination from "../../../components/Pagination"
import AddAdmin from "./add"
import EditAdmin from "./edit"
import DeleteAdmin from "./delete"
import ResetPasswordAdmin from "./resetPassword"
import { UserCog, Phone, Mail, Calendar, Shield, MoreVertical } from "lucide-react"
import { PageHeader } from "../../../components/ui/pageheader"
import { EmptyState } from "../../../components/ui/empetystate"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import Search from "../../../components/Search"




type ResultData = {
    success: boolean
    message: string
    data: Admin[]
    count: number
}

async function getAdmins(page: number, quantity: number, search: string): Promise<ResultData> {
    try {
        const token = await getCookies("accessToken")
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins?page=${page}&quantity=${quantity}&search=${search}`,
            {
                headers: { "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "", "Authorization": `Bearer ${token}` },
                cache: "no-store"
            }
        )
        const data: ResultData = await res.json()
        return res.ok ? data : { success: false, message: data.message, data: [], count: 0 }
    } catch (e) {
        return { success: false, message: "Gagal memuat data", data: [], count: 0 }
    }
}

type Props = { searchParams: Promise<{ page?: number; quantity?: number; search?: string }> }

export default async function AdminsPage(prop: Props) {
    const page = (await prop.searchParams)?.page || 1
    const quantity = (await prop.searchParams)?.quantity || 3 // Naikkan dari 4 ke 6
    const search = (await prop.searchParams)?.search || ""
    const { count, data: admins } = await getAdmins(page, quantity, search)

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <PageHeader
                title="Data Administrator"
                description="Kelola semua akun administrator sistem PDAM"
                actions={<AddAdmin />}
            />

            {/* Search - Diperbesar */}
            <div className="mb-6 max-w-md">
                <Search search={search} placeholder="Cari admin berdasarkan nama atau username..." />
            </div>

            {/* Content */}
            {admins.length === 0 ? (
                <EmptyState
                    title="Tidak ada admin ditemukan"
                    description={search ? `Tidak ada hasil untuk pencarian "${search}"` : "Belum ada administrator yang terdaftar."}
                    action={{
                        text :"Tambah Admin Baru",
                        onClick: () => document.getElementById('add-admin-trigger')?.click()
                    }}
                />
            ) : (
                <>
                    {/* Grid dengan card yang lebih besar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {admins.map((admin) => (
                            <div
                                key={admin.id}
                                className="bg-white border-2 border-[#C2D9F0] rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Header dengan Avatar besar dan Actions */}
                                <div className="flex items-start justify-between mb-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#1E4A7A] to-[#0A2A44] rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-md">
                                            {admin.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-xl text-[#0A2A44]">{admin.name}</p>
                                            <p className="text-base text-gray-500">@{admin.user.username}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Dropdown Menu untuk actions */}
                                    <DropdownMenu >
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-[#E1EEFB]">
                                                <MoreVertical className="h-5 w-5 text-gray-500" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem onSelect={() => {}}>
                                                <EditAdmin selectedData={admin} />
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => {}}>
                                                <ResetPasswordAdmin selectedData={admin} />
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => {}} className="text-red-600 focus:text-red-600">
                                                <DeleteAdmin selectedData={admin} />
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Info Details - Dengan font lebih besar */}
                                <div className="space-y-3 mb-5">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Mail className="w-5 h-5 text-[#1E4A7A]" />
                                        <span className="text-base">{admin.user.username}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Phone className="w-5 h-5 text-[#1E4A7A]" />
                                        <span className="text-base">{admin.phone || "-"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Calendar className="w-5 h-5 text-[#1E4A7A]" />
                                        <span className="text-base">
                                            {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            }) : "-"}
                                        </span>
                                    </div>
                                </div>

                                {/* Badge Role */}
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center gap-2 bg-[#E1EEFB] text-[#1E4A7A] px-4 py-2 rounded-full text-sm font-semibold">
                                        <Shield className="w-4 h-4" />
                                        Administrator
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        ID: {admin.id.toString().slice(0, 8)}...
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-8 justify-center">
                        <Pagination 
                            count={count} 
                            perPage={quantity} 
                            currentPage={page}
                        />
                    </div>

                    {/* Info Total Data */}
                    <p className="text-center text-gray-500 text-base mt-4">
                        Menampilkan {admins.length} dari {count} administrator
                    </p>
                </>
            )}
        </div>
    )
}