import { Admin } from "../../types"
import { getCookies } from "../../../lib/server-cookies"
import { Mail, Phone, Calendar, Shield } from "lucide-react"
import { PageHeader } from "../../../components/ui/pageheader"
import { EmptyState } from "../../../components/ui/empetystate"
import Search from "../../../components/Search"
import Pagination from "../../../components/Pagination"
import AddAdmin from "./add"
import { AdminActions } from "./actions"

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
    } catch {
        return { success: false, message: "Gagal memuat data", data: [], count: 0 }
    }
}

type Props = { searchParams: Promise<{ page?: number; quantity?: number; search?: string }> }

export default async function AdminsPage(prop: Props) {
    const page = (await prop.searchParams)?.page || 1
    const quantity = (await prop.searchParams)?.quantity || 3
    const search = (await prop.searchParams)?.search || ""
    const { count, data: admins } = await getAdmins(page, quantity, search)

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <PageHeader
                title="Data Administrator"
                description="Kelola semua akun administrator sistem PDAM"
                actions={<AddAdmin />}
            />

            <div className="mb-6 max-w-md">
                <Search search={search} placeholder="Cari admin berdasarkan nama atau username..." />
            </div>

            {admins.length === 0 ? (
                <EmptyState
                    title="Tidak ada admin ditemukan"
                    description={search ? `Tidak ada hasil untuk "${search}"` : "Belum ada administrator yang terdaftar."}
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {admins.map((admin) => (
                            <div
                                key={admin.id}
                                className="bg-white border-2 border-[#C2D9F0] rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-linear-to-br from-[#1E4A7A] to-[#0A2A44] rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-md">
                                            {admin.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-xl text-[#0A2A44]">{admin.name}</p>
                                            <p className="text-base text-gray-500">@{admin.user.username}</p>
                                        </div>
                                    </div>
                                    <AdminActions admin={admin} />
                                </div>

                                {/* Info */}
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
                                            {admin.createdAt
                                                ? new Date(admin.createdAt).toLocaleDateString("id-ID", {
                                                    day: "numeric", month: "long", year: "numeric"
                                                })
                                                : "-"}
                                        </span>
                                    </div>
                                </div>

                                {/* Badge */}
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

                    <div className="mt-8">
                        <Pagination count={count} perPage={quantity} currentPage={page} />
                    </div>

                    <p className="text-center text-gray-500 text-base mt-4">
                        Menampilkan {admins.length} dari {count} administrator
                    </p>
                </>
            )}
        </div>
    )
}