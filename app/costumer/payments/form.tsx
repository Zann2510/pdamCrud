"use client"

import { Bill, Payment } from "../../types"
import { useState, FormEvent, useRef } from "react"
import { getCookie } from "cookies-next/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    Clock, CheckCircle, XCircle,
    Receipt, Banknote, Wallet, Upload, ImageIcon
} from "lucide-react"
import { Button } from "../../../components/ui/button"

const PAYMENT_METHODS = [
    { value: "TRANSFER_BANK", label: "Transfer Bank" },
    { value: "VIRTUAL_ACCOUNT", label: "Virtual Account" },
    { value: "CASH", label: "Tunai di Loket" },
]

// ✅ FIX: StatusBadge aman dari status undefined/tidak dikenal
const StatusBadge = ({ status }: { status: string | undefined }) => {
    // Normalisasi ke uppercase untuk jaga-jaga backend kirim lowercase
    const normalized = (status ?? "").toUpperCase()

    if (normalized === "APPROVED") {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                <CheckCircle className="w-3 h-3" /> Disetujui
            </span>
        )
    }

    if (normalized === "REJECTED") {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700">
                <XCircle className="w-3 h-3" /> Ditolak
            </span>
        )
    }

    // Default: PENDING atau apapun yang tidak dikenal
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
            <Clock className="w-3 h-3" /> Menunggu Verifikasi
        </span>
    )
}

export default function PaymentForm({
    unpaidBills,
    myPayments
}: {
    unpaidBills: Bill[]
    myPayments: Payment[]
}) {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [selectedBillId, setSelectedBillId] = useState<number>(0)
    const [proofFile, setProofFile] = useState<File | null>(null)
    const [proofPreview, setProofPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const selectedBill = unpaidBills.find(b => b.id === selectedBillId)

    // ✅ Debug — lihat struktur data payment dari backend di browser console
    if (myPayments.length > 0) {
        console.log("Sample payment data:", JSON.stringify(myPayments[0], null, 2))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            toast.warning("Ukuran file maksimal 2MB")
            return
        }

        if (!["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type)) {
            toast.warning("Format file harus JPG, PNG, atau WEBP")
            return
        }

        setProofFile(file)
        setProofPreview(URL.createObjectURL(file))
    }

    const handleRemoveFile = () => {
        setProofFile(null)
        setProofPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!selectedBillId) {
            toast.warning("Pilih tagihan terlebih dahulu")
            return
        }
        if (!proofFile) {
            toast.warning("Bukti pembayaran wajib diupload")
            return
        }

        setLoading(true)
        try {
            const token = await getCookie("accessToken")

            const formData = new FormData()
            formData.append("bill_id", String(selectedBillId))
            formData.append("file", proofFile)

            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/payments`, {
                method: "POST",
                headers: {
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            })

            const result = await res.json()
            if (result?.success) {
                toast.success("Pembayaran berhasil diajukan, menunggu verifikasi admin")
                setSelectedBillId(0)
                handleRemoveFile()
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast.warning(result?.message)
            }
        } catch {
            toast.error("Terjadi kesalahan. Coba lagi.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Form Ajukan Pembayaran */}
            {unpaidBills.length > 0 ? (
                <div className="bg-white border-2 border-[#C2D9F0] rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-[#E6F0F9] rounded-lg flex items-center justify-center">
                            <Banknote className="w-5 h-5 text-[#0F5B8C]" />
                        </div>
                        <div>
                            <h2 className="font-bold text-[#0A2A44]">Ajukan Pembayaran</h2>
                            <p className="text-sm text-gray-500">Upload bukti bayar untuk tagihan Anda</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Tagihan <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0F5B8C] transition-colors"
                                value={selectedBillId}
                                onChange={e => setSelectedBillId(Number(e.target.value))}
                            >
                                <option value={0}>Pilih Tagihan</option>
                                {unpaidBills.map(bill => (
                                    <option key={bill.id} value={bill.id}>
                                        {new Date(bill.year, bill.month - 1).toLocaleDateString("id-ID", {
                                            month: "long", year: "numeric"
                                        })} — Rp {(bill.usage_value * bill.price).toLocaleString("id-ID")}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedBill && (
                            <div className="bg-[#E6F0F9] rounded-xl p-4 flex items-center justify-between">
                                <span className="text-sm text-[#0F5B8C] font-medium">Total Pembayaran</span>
                                <span className="text-xl font-bold text-[#0F5B8C]">
                                    Rp {(selectedBill.usage_value * selectedBill.price).toLocaleString("id-ID")}
                                </span>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Bukti Pembayaran <span className="text-red-500">*</span>
                            </label>

                            {!proofPreview ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#0F5B8C] hover:bg-[#E6F0F9]/30 transition-all"
                                >
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-gray-600">Klik untuk upload foto bukti transfer</p>
                                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — Maks. 2MB</p>
                                </div>
                            ) : (
                                <div className="relative rounded-xl overflow-hidden border-2 border-[#0F5B8C]">
                                    <img
                                        src={proofPreview}
                                        alt="Bukti pembayaran"
                                        className="w-full max-h-52 object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                                    >
                                        ✕
                                    </button>
                                    <div className="p-2.5 bg-[#E6F0F9] flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-[#0F5B8C] shrink-0" />
                                        <span className="text-xs text-[#0F5B8C] font-medium truncate">
                                            {proofFile?.name}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                            <p className="text-xs text-amber-700">
                                <span className="font-semibold">Catatan:</span> Admin akan memverifikasi bukti pembayaran Anda. Status tagihan berubah lunas setelah diverifikasi.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || !selectedBillId || !proofFile}
                            className="w-full"
                        >
                            {loading ? "Memproses..." : "Ajukan Pembayaran"}
                        </Button>
                    </form>
                </div>
            ) : (
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 text-center">
                    <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
                    <p className="font-bold text-emerald-800 text-lg">Semua tagihan telah dibayar!</p>
                    <p className="text-sm text-emerald-600 mt-1">Tidak ada tagihan yang perlu dibayar.</p>
                </div>
            )}

            {/* Riwayat Pembayaran */}
            <div>
                <h2 className="font-bold text-[#0A2A44] mb-4 text-lg">Riwayat Pembayaran</h2>

                {myPayments.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border-2 border-[#C2D9F0]">
                        <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="font-medium text-gray-500">Belum ada riwayat pembayaran</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {myPayments
                            .sort((a, b) =>
                                new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
                            )
                            .map(payment => {
                                // ✅ Aman dari semua kemungkinan undefined
                                const displayAmount = payment.amount
                                    ?? (payment.bill
                                        ? (payment.bill.usage_value ?? 0) * (payment.bill.price ?? 0)
                                        : 0)

                                const statusNorm = (payment.status ?? "").toUpperCase()
                                const borderColor = statusNorm === "APPROVED"
                                    ? "border-emerald-200"
                                    : statusNorm === "REJECTED"
                                    ? "border-red-200"
                                    : "border-amber-200"

                                const iconBg = statusNorm === "APPROVED"
                                    ? "bg-emerald-50"
                                    : statusNorm === "REJECTED"
                                    ? "bg-red-50"
                                    : "bg-amber-50"

                                const iconColor = statusNorm === "APPROVED"
                                    ? "text-emerald-600"
                                    : statusNorm === "REJECTED"
                                    ? "text-red-500"
                                    : "text-amber-500"

                                return (
                                    <div
                                        key={payment.id}
                                        className={`bg-white rounded-xl border-2 p-4 transition-all ${borderColor}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
                                                    <Receipt className={`w-5 h-5 ${iconColor}`} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm text-[#0A2A44]">
                                                        Rp {displayAmount.toLocaleString("id-ID")}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {payment.createdAt
                                                            ? new Date(payment.createdAt).toLocaleDateString("id-ID", {
                                                                day: "numeric",
                                                                month: "long",
                                                                year: "numeric"
                                                            })
                                                            : "-"
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <StatusBadge status={payment.status} />
                                        </div>

                                        {statusNorm === "REJECTED" && (
                                            <div className="mt-3 pt-3 border-t border-red-100">
                                                <p className="text-xs text-red-600">
                                                    Pembayaran ditolak. Silakan ajukan ulang dengan bukti yang valid.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                    </div>
                )}
            </div>
        </div>
    )
}