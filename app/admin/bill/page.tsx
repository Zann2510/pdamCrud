import { Bill, Customer } from "../../types"
import { getCookies } from "../../../lib/server-cookies"
import { Calendar, Droplets, BadgeDollarSign, CheckCircle, Clock } from "lucide-react"
import { PageHeader } from "../../../components/ui/pageheader"
import { EmptyState } from "../../../components/ui/empetystate"
import Search from "../../../components/Search"
import Pagination from "../../../components/Pagination"
import AddBill from "./add"
import { BillActions } from "./actions"

type BillResult = { success: boolean; message: string; data: Bill[]; count: number }
type CustomerResult = { success: boolean; data: Customer[] }

async function getBills(page: number, quantity: number, search: string): Promise<BillResult> {
    try {
        const token = await getCookies("accessToken")
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/bills?page=${page}&quantity=${quantity}&search=${search}`,
            { headers: { "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "", "Authorization": `Bearer ${token}` }, cache: "no-store" }
        )
        const data: BillResult = await res.json()
        return res.ok ? data : { success: false, message: data.message, data: [], count: 0 }
    } catch { return { success: false, message: "Gagal memuat data", data: [], count: 0 } }
}

async function getAllCustomers(): Promise<Customer[]> {
    try {
        const token = await getCookies("accessToken")
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/customers?page=1&quantity=1000`,
            { headers: { "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "", "Authorization": `Bearer ${token}` }, cache: "no-store" }
        )
        const data: CustomerResult = await res.json()
        return res.ok ? data.data : []
    } catch { return [] }
}

type Props = { searchParams: Promise<{ page?: number; quantity?: number; search?: string }> }

export default async function BillPage(prop: Props) {
    const page = (await prop.searchParams)?.page || 1
    const quantity = (await prop.searchParams)?.quantity || 9
    const search = (await prop.searchParams)?.search || ""

    const [{ count, data: bills }, customers] = await Promise.all([
        getBills(page, quantity, search),
        getAllCustomers()
    ])

    // ✅ Gunakan field dari API yang benar
    const totalUnpaid = bills.filter(b => b.paid === false).length
    const totalPaid = bills.filter(b => b.paid === true).length
    const totalRevenue = bills
        .filter(b => b.paid === true)
        .reduce((sum, b) => sum + (b.usage_value * (b.price || 0)), 0)

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <PageHeader
                title="Data Tagihan"
                description="Kelola tagihan pemakaian air pelanggan PDAM"
                actions={<AddBill customers={customers} />}
            />

            {/* Ringkasan Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border-2 border-[#C2D9F0] rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Belum Dibayar</p>
                        <p className="text-2xl font-bold text-amber-600">{totalUnpaid}</p>
                    </div>
                </div>
                <div className="bg-white border-2 border-[#C2D9F0] rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Sudah Dibayar</p>
                        <p className="text-2xl font-bold text-emerald-600">{totalPaid}</p>
                    </div>
                </div>
                <div className="bg-white border-2 border-[#C2D9F0] rounded-xl p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#E6F0F9] rounded-lg flex items-center justify-center">
                        <BadgeDollarSign className="w-5 h-5 text-[#0F5B8C]" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Total Pendapatan</p>
                        <p className="text-lg font-bold text-[#0F5B8C]">
                            Rp {totalRevenue.toLocaleString("id-ID")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6 max-w-md">
                <Search search={search} placeholder="Cari berdasarkan nama pelanggan..." />
            </div>

            {bills.length === 0 ? (
                <EmptyState
                    title="Tidak ada tagihan ditemukan"
                    description={search ? `Tidak ada hasil untuk "${search}"` : "Belum ada tagihan yang dibuat."}
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {bills.map((bill) => (
                            <div
                                key={bill.id}
                                className="bg-white border-2 border-[#C2D9F0] rounded-2xl p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-linear-to-br from-[#1E4A7A] to-[#0A2A44] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                            {bill.customer?.name?.charAt(0).toUpperCase() ?? "?"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#0A2A44] text-base leading-tight">
                                                {bill.customer?.name ?? "-"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {bill.customer?.customer_number ?? "-"}
                                            </p>
                                        </div>
                                    </div>
                                    <BillActions bill={bill} />
                                </div>

                                {/* ✅ Period dari month + year */}
                                <div className="flex items-center gap-2 mb-3">
                                    <Calendar className="w-4 h-4 text-[#0F5B8C]" />
                                    <span className="text-sm font-semibold text-[#0F5B8C]">
                                        {new Date(bill.year, bill.month - 1).toLocaleDateString("id-ID", {
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </span>
                                </div>

                                {/* ✅ Info baris */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2 text-gray-500">
                                            <Droplets className="w-4 h-4 text-blue-400" />
                                            Pemakaian
                                        </span>
                                        {/* ✅ usage_value bukan usage */}
                                        <span className="font-semibold text-gray-800">{bill.usage_value} m³</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2 text-gray-500">
                                            <BadgeDollarSign className="w-4 h-4 text-emerald-500" />
                                            Total Tagihan
                                        </span>
                                        {/* ✅ Hitung dari usage_value * price */}
                                        <span className="font-bold text-emerald-600">
                                            Rp {(bill.usage_value * bill.price).toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                </div>

                                {/* ✅ Status dari paid (boolean) */}
                                <div className="flex items-center justify-between border-t-2 border-[#E1EEFB] pt-3">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                        bill.paid
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-amber-50 text-amber-700"
                                    }`}>
                                        {bill.paid
                                            ? <><CheckCircle className="w-3.5 h-3.5" /> Lunas</>
                                            : <><Clock className="w-3.5 h-3.5" /> Belum Dibayar</>
                                        }
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        #{bill.id.toString().slice(0, 6)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <Pagination count={count} perPage={quantity} currentPage={page} />
                    </div>

                    <p className="text-center text-gray-500 text-sm mt-4">
                        Menampilkan {bills.length} dari {count} tagihan
                    </p>
                </>
            )}
        </div>
    )
}