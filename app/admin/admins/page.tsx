import { Admin } from "../../types"
import { getCookies } from "../../../lib/server-cookies"
import Search from "../../../components/Search"
import Pagination from "../../../components/Pagination"
import AddAdmin from "./add"
import EditAdmin from "./edit"
import DeleteAdmin from "./delete"
import ResetPasswordAdmin from "./resetPassword"
import { UserCog, Phone } from "lucide-react"
import { PageHeader } from "../../../components/ui/pageheader"
import { EmptyState } from "../../../components/ui/empetystate"

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
    const quantity = (await prop.searchParams)?.quantity || 10
    const search = (await prop.searchParams)?.search || ""
    const { count, data: admins } = await getAdmins(page, quantity, search)

    return (
        <div className="p-6 animate-fade-in">
            <PageHeader
                title="Admin Data"
                description="Kelola semua akun administrator sistem"
                actions={<AddAdmin />}
            />

            {/* Search */}
            <div className="mb-5 max-w-sm">
                <Search search={search} />
            </div>

            {/* Content */}
            {admins.length === 0 ? (
                <EmptyState
                    title="Tidak ada admin ditemukan"
                    description={search ? `Tidak ada hasil untuk "${search}"` : "Belum ada admin yang terdaftar."}
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {admins.map((admin) => (
                            <div
                                key={admin.id}
                                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200"
                            >
                                {/* Avatar + Name */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-11 h-11 bg-[#E6F0F9] rounded-full flex items-center justify-center text-[#0F5B8C] font-bold text-lg flex-shrink-0">
                                        {admin.name?.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{admin.name}</p>
                                        <p className="text-xs text-gray-500 truncate">@{admin.user.username}</p>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>{admin.phone}</span>
                                </div>

                                {/* Badge */}
                                <div className="mb-4">
                                    <span className="inline-flex items-center gap-1 text-xs bg-[#E6F0F9] text-[#0F5B8C] px-2 py-0.5 rounded-full font-medium">
                                        <UserCog className="w-3 h-3" /> Administrator
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 flex-wrap border-t border-gray-100 pt-3">
                                    <EditAdmin selectedData={admin} />
                                    <DeleteAdmin selectedData={admin} />
                                    <ResetPasswordAdmin selectedData={admin} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <Pagination count={count} perPage={quantity} currentPage={page} />
                    </div>
                </>
            )}
        </div>
    )
}