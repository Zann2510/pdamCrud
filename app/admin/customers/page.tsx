import { Customer, Services } from "../../types"
import { getCookies } from "../../../lib/server-cookies"
import { MapPin, Phone, Droplet, Hash, Home } from "lucide-react"
import { PageHeader } from "../../../components/ui/pageheader"
import { EmptyState } from "../../../components/ui/empetystate"
import Search from "../../../components/Search"
import Pagination from "../../../components/Pagination"
import AddCustomer from "./add"
import { CustomerActions } from "./actions"

type ResultData = { success: boolean; message: string; data: Customer[]; count: number }
type ServiceData = { success: boolean; data: Services[] }

async function getCustomers(page: number, quantity: number, search: string): Promise<ResultData> {
    try {
        const token = await getCookies("accessToken")
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers?page=${page}&quantity=${quantity}&search=${search}`,
            { headers: { "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "", "Authorization": `Bearer ${token}` }, cache: "no-store" }
        )
        const data: ResultData = await res.json()
        return res.ok ? data : { success: false, message: data.message, data: [], count: 0 }
    } catch { return { success: false, message: "Gagal memuat data", data: [], count: 0 } }
}

async function getServices(): Promise<Services[]> {
    try {
        const token = await getCookies("accessToken")
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/services`,
            { headers: { "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "", "Authorization": `Bearer ${token}` }, cache: "no-store" }
        )
        const data: ServiceData = await res.json()
        return res.ok ? data.data : []
    } catch { return [] }
}

type Props = { searchParams: Promise<{ page?: number; quantity?: number; search?: string }> }

export default async function CustomersPage(prop: Props) {
    const page = (await prop.searchParams)?.page || 1
    const quantity = (await prop.searchParams)?.quantity || 3
    const search = (await prop.searchParams)?.search || ""
    const [{ count, data: customers }, services] = await Promise.all([
        getCustomers(page, quantity, search),
        getServices()
    ])

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <PageHeader
                title="Data Pelanggan"
                description="Kelola semua data pelanggan PDAM"
                actions={<AddCustomer serviceData={services} />}
            />

            <div className="mb-6 max-w-md">
                <Search search={search} placeholder="Cari pelanggan berdasarkan nama, nomor, atau alamat..." />
            </div>

            {customers.length === 0 ? (
                <EmptyState
                    title="Tidak ada pelanggan ditemukan"
                    description={search ? `Tidak ada hasil untuk pencarian "${search}"` : "Belum ada pelanggan yang terdaftar."}
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {customers.map((customer) => (
                            <div key={customer.id} className="bg-white border-2 border-[#C2D9F0] rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-md">
                                            {customer.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-xl text-[#0A2A44]">{customer.name}</p>
                                            <p className="text-base text-gray-500">{customer.customer_number}</p>
                                        </div>
                                    </div>
                                    {/* ✅ Client Component tersendiri */}
                                    <CustomerActions customer={customer} services={services} />
                                </div>

                                {/* Info */}
                                <div className="space-y-3 mb-5">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Hash className="w-5 h-5 text-emerald-600" />
                                        <span className="text-base font-medium">{customer.customer_number}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Phone className="w-5 h-5 text-emerald-600" />
                                        <span className="text-base">{customer.phone}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-600">
                                        <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                                        <span className="text-base">{customer.address}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Home className="w-5 h-5 text-emerald-600" />
                                        <span className="text-base">
                                            Bergabung:{" "}
                                            {new Date(customer.createdAt).toLocaleDateString("id-ID", {
                                                day: "numeric", month: "short", year: "numeric"
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Service Badge */}
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
                                        <Droplet className="w-4 h-4" />
                                        {customer.service.name}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        ID: {customer.id.toString().slice(0, 8)}...
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <Pagination count={count} perPage={quantity} currentPage={page} />
                    </div>

                    <p className="text-center text-gray-500 text-base mt-4">
                        Menampilkan {customers.length} dari {count} pelanggan
                    </p>
                </>
            )}
        </div>
    )
}