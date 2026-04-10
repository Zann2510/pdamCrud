import { Payment } from "../../types"
import { getCookies } from "../../../lib/server-cookies"
import { PageHeader } from "../../../components/ui/pageheader"
import { EmptyState } from "../../../components/ui/empetystate"
import { Clock, CheckCircle, XCircle, Banknote } from "lucide-react"
import Search from "../../../components/Search"
import Pagination from "../../../components/Pagination"
import { PaymentActions } from "./actions"
import Link from "next/link"

type PaymentResult = { 
    success: boolean; message: string
    data: Payment[]; count: number 
}

async function getPayments(
    page: number, quantity: number, 
    search: string, status: string
): Promise<PaymentResult> {
    try {
        const token = await getCookies("accessToken")
        const params = new URLSearchParams({
            page: String(page), quantity: String(quantity),
            search, ...(status && { status })
        })
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API_URL}/payments?${params}`,
            {
                headers: {
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`
                },
                cache: "no-store"
            }
        )
        const data: PaymentResult = await res.json()
        return res.ok ? data : { success: false, message: data.message, data: [], count: 0 }
    } catch {
        return { success: false, message: "Gagal memuat data", data: [], count: 0 }
    }
}

type Props = {
    searchParams: Promise<{ 
        page?: number; quantity?: number
        search?: string; status?: string 
    }>
}

const STATUS_TABS = [
    { value: "",         label: "Semua",   icon: Banknote },
    { value: "PENDING",  label: "Pending", icon: Clock },
    { value: "APPROVED", label: "Disetujui", icon: CheckCircle },
    { value: "REJECTED", label: "Ditolak",   icon: XCircle },
]

export default async function AdminPaymentsPage(prop: Props) {
    const params   = await prop.searchParams
    const page     = params?.page     || 1
    const quantity = params?.quantity || 9
    const search   = params?.search   || ""
    const status   = params?.status   || ""

    const { count, data: payments } = await getPayments(page, quantity, search, status)

    const totalPending  = payments.filter(p => p.status === "PENDING").length
    const totalApproved = payments.filter(p => p.status === "APPROVED").length
    const totalRejected = payments.filter(p => p.status === "REJECTED").length

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            <PageHeader
                title="Data Pembayaran"
                description="Verifikasi pembayaran tagihan air pelanggan"
            />

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white border-2 border-amber-200 rounded-xl p-4 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <div>
                        <p className="text-xs text-gray-500">Menunggu</p>
                        <p className="text-xl font-bold text-amber-600">{totalPending}</p>
                    </div>
                </div>
                <div className="bg-white border-2 border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <div>
                        <p className="text-xs text-gray-500">Disetujui</p>
                        <p className="text-xl font-bold text-emerald-600">{totalApproved}</p>
                    </div>
                </div>
                <div className="bg-white border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <div>
                        <p className="text-xs text-gray-500">Ditolak</p>
                        <p className="text-xl font-bold text-red-600">{totalRejected}</p>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                {STATUS_TABS.map(tab => {
                    const Icon = tab.icon
                    const isActive = status === tab.value
                    const href = tab.value
                        ? `?status=${tab.value}&page=1`
                        : `?page=1`
                    return (
                        <Link
                            key={tab.value}
                            href={href}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                isActive
                                    ? "bg-[#0F5B8C] text-white"
                                    : "bg-white border-2 border-gray-200 text-gray-600 hover:border-[#0F5B8C]"
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </Link>
                    )
                })}
            </div>

            <div className="mb-5 max-w-md">
                <Search search={search} placeholder="Cari berdasarkan nama pelanggan..." />
            </div>

            {payments.length === 0 ? (
                <EmptyState
                    title="Tidak ada pembayaran ditemukan"
                    description="Belum ada data pembayaran pada filter ini."
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {payments.map(payment => (
                            <div
                                key={payment.id}
                                className={`bg-white rounded-2xl border-2 p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                                    payment.status === "PENDING"
                                        ? "border-amber-200"
                                        : payment.status === "APPROVED"
                                        ? "border-emerald-200"
                                        : "border-red-200"
                                }`}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="font-bold text-[#0A2A44]">
                                            {payment.customer?.name ?? "-"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {payment.customer?.customer_number ?? "-"}
                                        </p>
                                    </div>
                                    {/* Actions dropdown */}
                                    <PaymentActions payment={payment} />
                                </div>

                                {/* Amount */}
                                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                                    <p className="text-xs text-gray-500 mb-0.5">Jumlah Bayar</p>
                                    <p className="text-xl font-bold text-[#0A2A44]">
                                        Rp {payment.amount.toLocaleString("id-ID")}
                                    </p>
                                </div>

                                {/* Info */}
                                <div className="space-y-1.5 mb-4 text-sm text-gray-600">
                                    <p>Metode: <span className="font-medium">{payment.payment_method.replace("_", " ")}</span></p>
                                    <p>Tanggal: <span className="font-medium">{new Date(payment.createdAt).toLocaleDateString("id-ID")}</span></p>
                                    {payment.notes && (
                                        <p className="text-xs text-gray-500 italic">"{payment.notes}"</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                    payment.status === "PENDING"
                                        ? "bg-amber-50 text-amber-700"
                                        : payment.status === "APPROVED"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-red-50 text-red-700"
                                }`}>
                                    {payment.status === "PENDING" && <><Clock className="w-3 h-3" /> Menunggu</>}
                                    {payment.status === "APPROVED" && <><CheckCircle className="w-3 h-3" /> Disetujui</>}
                                    {payment.status === "REJECTED" && <><XCircle className="w-3 h-3" /> Ditolak</>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <Pagination count={count} perPage={quantity} currentPage={page} />
                    </div>
                    <p className="text-center text-gray-500 text-sm mt-4">
                        Menampilkan {payments.length} dari {count} pembayaran
                    </p>
                </>
            )}
        </div>
    )
}