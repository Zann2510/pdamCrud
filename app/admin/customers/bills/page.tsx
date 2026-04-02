import { Receipt, Calendar, Droplets, BadgeDollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { PageHeader } from "../../../../components/ui/pageheader"
import { getCookies } from "../../../../lib/server-cookies"
import { Bill } from "../../../types"

type BillResult = { success: boolean; message: string; data: Bill[]; count: number }

async function getMyBills(): Promise<Bill[]> {
    try {
        const token = await getCookies("accessToken")
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/bills/me`,
            { headers: { "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "", "Authorization": `Bearer ${token}` }, cache: "no-store" }
        )
        const data: BillResult = await res.json()
        return res.ok ? data.data : []
    } catch { return [] }
}

export default async function CustomerBillsPage() {
    const bills = await getMyBills()

    // ✅ Gunakan paid (boolean)
    const totalUnpaid = bills.filter(b => b.paid === false).length
    const totalTagihan = bills
        .filter(b => b.paid === false)
        .reduce((sum, b) => sum + (b.usage_value * b.price), 0)

    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader
                title="Tagihan Saya"
                description="Riwayat dan status tagihan pemakaian air"
            />

            {/* Alert kalau ada tagihan belum bayar */}
            {totalUnpaid > 0 && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-amber-800">
                            Anda memiliki {totalUnpaid} tagihan belum dibayar
                        </p>
                        <p className="text-sm text-amber-700 mt-0.5">
                            Total: Rp {totalTagihan.toLocaleString("id-ID")}
                        </p>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border-2 border-[#C2D9F0] rounded-xl p-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-3">
                        <Clock className="w-5 h-5 text-amber-500" />
                    </div>
                    <p className="text-xs text-gray-500">Belum Dibayar</p>
                    <p className="text-2xl font-bold text-amber-600">{totalUnpaid}</p>
                </div>
                <div className="bg-white border-2 border-[#C2D9F0] rounded-xl p-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                    </div>
                    <p className="text-xs text-gray-500">Sudah Dibayar</p>
                    <p className="text-2xl font-bold text-emerald-600">
                        {/* ✅ paid === true */}
                        {bills.filter(b => b.paid === true).length}
                    </p>
                </div>
            </div>

            {/* Bill List */}
            {bills.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border-2 border-[#C2D9F0]">
                    <Receipt className="w-14 h-14 text-gray-300 mx-auto mb-3" />
                    <p className="font-semibold text-gray-600 text-lg">Belum ada tagihan</p>
                    <p className="text-gray-400 text-sm mt-1">Tagihan akan muncul di sini setelah diproses admin.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {bills
                        // ✅ Sort dari year + month bukan period
                        .sort((a, b) => b.year !== a.year ? b.year - a.year : b.month - a.month)
                        .map((bill) => (
                            <div
                                key={bill.id}
                                className={`bg-white rounded-xl border-2 p-5 transition-all ${
                                    !bill.paid
                                        ? "border-amber-200 hover:border-amber-300"
                                        : "border-[#C2D9F0] hover:border-[#A8C8E8]"
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    {/* Left */}
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                            bill.paid ? "bg-emerald-50" : "bg-amber-50"
                                        }`}>
                                            <Receipt className={`w-6 h-6 ${
                                                bill.paid ? "text-emerald-600" : "text-amber-600"
                                            }`} />
                                        </div>
                                        <div>
                                            {/* ✅ Periode dari month + year */}
                                            <p className="font-bold text-[#0A2A44]">
                                                {new Date(bill.year, bill.month - 1).toLocaleDateString("id-ID", {
                                                    month: "long",
                                                    year: "numeric"
                                                })}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Droplets className="w-3.5 h-3.5 text-blue-400" />
                                                    {/* ✅ usage_value */}
                                                    {bill.usage_value} m³
                                                </span>
                                                <span className="text-gray-300">|</span>
                                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(bill.createdAt).toLocaleDateString("id-ID")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right */}
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-[#0A2A44]">
                                            {/* ✅ Hitung dari usage_value * price */}
                                            Rp {(bill.usage_value * bill.price).toLocaleString("id-ID")}
                                        </p>
                                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${
                                            bill.paid
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-amber-50 text-amber-700"
                                        }`}>
                                            {/* ✅ paid boolean */}
                                            {bill.paid
                                                ? <><CheckCircle className="w-3 h-3" /> Lunas</>
                                                : <><Clock className="w-3 h-3" /> Belum Bayar</>
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    )
}