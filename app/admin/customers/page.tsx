import { Customer, Services } from "../../types"
import { getCookies } from "../../../lib/server-cookies"
import Search from "../../../components/Search"
import Pagination from "../../../components/Pagination"
import AddCustomer from "./add"
import EditCustomer from "./edit"
import DeleteCustomer from "./delete"
import ResetPasswordCustomer from "./resetPassword"
import { MapPin, Phone, Droplets, Hash } from "lucide-react"
import { PageHeader } from "../../../components/ui/pageheader"
import { EmptyState } from "../../../components/ui/empetystate"

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
    const quantity = (await prop.searchParams)?.quantity || 10
    const search = (await prop.searchParams)?.search || ""
    const [{ count, data: customers }, services] = await Promise.all([
        getCustomers(page, quantity, search),
        getServices()
    ])

    return (
        <div className="p-6 animate-fade-in">
            <PageHeader
                title="Customer Data"
                description="Kelola semua data pelanggan PDAM"
                actions={<AddCustomer serviceData={services} />}
            />

            <div className="mb-5 max-w-sm">
                <Search search={search} />
            </div>

            {customers.length === 0 ? (
                <EmptyState
                    title="Tidak ada pelanggan ditemukan"
                    description={search ? `Tidak ada hasil untuk "${search}"` : "Belum ada pelanggan yang terdaftar."}
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {customers.map((customer) => (
                            <div key={customer.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200">
                                {/* Avatar + Name */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-11 h-11 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg flex-shrink-0">
                                        {customer.name?.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{customer.name}</p>
                                        <p className="text-xs text-gray-500 truncate">@{customer.user.username}</p>
                                    </div>
                                </div>

                                {/* Info rows */}
                                <div className="space-y-1.5 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span className="truncate">{customer.customer_number}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span>{customer.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span className="truncate">{customer.address}</span>
                                    </div>
                                </div>

                                {/* Service badge */}
                                <div className="mb-4">
                                    <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                                        <Droplets className="w-3 h-3" /> {customer.service.name}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 flex-wrap border-t border-gray-100 pt-3">
                                    <EditCustomer selectedData={customer} serviceData={services} />
                                    <DeleteCustomer selectedData={customer} />
                                    <ResetPasswordCustomer selectedData={customer} />
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