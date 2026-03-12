import { Services } from "../../types"
import { getCookies } from "../../../lib/server-cookies"

import Search from "../../../components/Search"
import Pagination from "../../../components/Pagination"
import AddService from "./add"
import EditService from "./edit"
import DeleteService from "./delete"
import { Droplets, BadgeDollarSign, ArrowDownUp } from "lucide-react"
import { PageHeader } from "../../../components/ui/pageheader"
import { EmptyState } from "../../../components/ui/empetystate"

type ResultData = { success: boolean; message: string; data: Services[]; count: number }

async function getServices(page: number, quantity: number, search: string): Promise<ResultData> {
    try {
        const token = await getCookies("accessToken")
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/services?page=${page}&quantity=${quantity}&search=${search}`,
            { headers: { "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "", "Authorization": `Bearer ${token}` }, cache: "no-store" }
        )
        const data: ResultData = await res.json()
        return res.ok ? data : { success: false, message: data.message, data: [], count: 0 }
    } catch { return { success: false, message: "Gagal memuat data", data: [], count: 0 } }
}

type Props = { searchParams: Promise<{ page?: number; quantity?: number; search?: string }> }

export default async function ServicesPage(prop: Props) {
    const page = (await prop.searchParams)?.page || 1
    const quantity = (await prop.searchParams)?.quantity || 10
    const search = (await prop.searchParams)?.search || ""
    const { count, data: services } = await getServices(page, quantity, search)

    return (
        <div className="p-6 animate-fade-in">
            <PageHeader
                title="Services"
                description="Kelola paket layanan dan tarif PDAM"
                actions={<AddService />}
            />

            <div className="mb-5 max-w-sm">
                <Search search={search} />
            </div>

            {services.length === 0 ? (
                <EmptyState
                    title="Tidak ada service ditemukan"
                    description={search ? `Tidak ada hasil untuk "${search}"` : "Belum ada paket layanan yang tersedia."}
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map((service) => (
                            <div key={service.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200">
                                {/* Header */}
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Droplets className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{service.name}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">ID: {String(service.id).slice(0, 8)}...</p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-2 mb-3">
                                    <BadgeDollarSign className="w-4 h-4 text-emerald-500" />
                                    <span className="text-lg font-bold text-emerald-600">
                                        Rp {service.price.toLocaleString("id-ID")},-
                                    </span>
                                </div>

                                {/* Usage */}
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                    <ArrowDownUp className="w-3.5 h-3.5" />
                                    <span>{service.min_usage} – {service.max_usage} m³</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 border-t border-gray-100 pt-3">
                                    <EditService selectedData={service} />
                                    <DeleteService selectedData={service} />
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