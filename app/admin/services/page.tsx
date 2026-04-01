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
    const quantity = (await prop.searchParams)?.quantity || 3
    const search = (await prop.searchParams)?.search || ""
    const { count, data: services } = await getServices(page, quantity, search)

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <PageHeader
                title="Services"
                description="Kelola paket layanan dan tarif PDAM"
                actions={<AddService />}
            />

            <div className="mb-5 max-w-md">
                <Search search={search} placeholder="Cari layanan..." />
            </div>

            {services.length === 0 ? (
                <EmptyState
                    title="Tidak ada service ditemukan"
                    description={search ? `Tidak ada hasil untuk "${search}"` : "Belum ada paket layanan yang tersedia."}
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <div key={service.id} className="bg-white border-2 border-[#C2D9F0] rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                {/* Header */}
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Droplets className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-xl text-[#0A2A44]">{service.name}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            ID: {String(service.id).slice(0, 8)}...
                                        </p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-2 mb-4">
                                    <BadgeDollarSign className="w-5 h-5 text-emerald-500" />
                                    <span className="text-2xl font-bold text-emerald-600">
                                        Rp {service.price.toLocaleString("id-ID")},-
                                    </span>
                                </div>

                                {/* Usage */}
                                <div className="flex items-center gap-2 text-base text-gray-500 mb-5">
                                    <ArrowDownUp className="w-4 h-4" />
                                    <span>{service.min_usage} – {service.max_usage} m³</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 border-t-2 border-[#E1EEFB] pt-4">
                                    <EditService selectedData={service} />
                                    <DeleteService selectedData={service} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8">
                        <Pagination count={count} perPage={quantity} currentPage={page} />
                    </div>
                    <p className="text-center text-gray-500 text-base mt-4">
                        Menampilkan {services.length} dari {count} layanan
                    </p>
                </>
            )}
        </div>
    )
}