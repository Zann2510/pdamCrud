// app/costumer/payments/form.tsx
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

const StatusBadge = ({ status }: { status: Payment["status"] }) => {
    const map = {
        PENDING:  { label: "Menunggu Verifikasi", color: "bg-amber-50 text-amber-700",     icon: <Clock className="w-3 h-3" /> },
        APPROVED: { label: "Disetujui",           color: "bg-emerald-50 text-emerald-700", icon: <CheckCircle className="w-3 h-3" /> },
        REJECTED: { label: "Ditolak",             color: "bg-red-50 text-red-700",         icon: <XCircle className="w-3 h-3" /> },
    }
    const s = map[status]
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${s.color}`}>
            {s.icon} {s.label}
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
    const [method, setMethod] = useState("TRANSFER_BANK")
    const [notes, setNotes] = useState("")
    const [proofFile, setProofFile] = useState<File | null>(null)
    const [proofPreview, setProofPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const selectedBill = unpaidBills.find(b => b.id === selectedBillId)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validasi ukuran max 2MB
        if (file.size > 2 * 1024 * 1024) {
            toast.warning("Ukuran file maksimal 2MB")
            return
        }

        // Validasi tipe file
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

        // ✅ Validasi proof file wajib diisi
        if (!proofFile) {
            toast.warning("Bukti pembayaran wajib diupload")
            return
        }

        setLoading(true)
        try {
            const token = await getCookie("accessToken")

            // ✅ Gunakan FormData karena ada file upload
            const formData = new FormData()
            formData.append("bill_id", String(selectedBillId))
            formData.append("payment_method", method)
            formData.append("amount", String(selectedBill ? selectedBill.usage_value * selectedBill.price : 0))
            formData.append("notes", notes)
            formData.append("proof_file", proofFile)  // ← field name sesuaikan dengan backend

            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/payments`, {
                method: "POST",
                headers: {
                    // ✅ Jangan set Content-Type saat FormData — browser akan otomatis set boundary
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            })

            const result = await res.json()
            if (result?.success) {
                toast.success("Pembayaran berhasil diajukan, menunggu verifikasi admin")
                setSelectedBillId(0)
                setNotes("")
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
            {unpaidBills.length > 0 ? (
                <div className="bg-white border-2 border-[#C2D9F0] rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-[#E6F0F9] rounded-lg flex items-center justify-center">
                            <Banknote className="w-5 h-5 text-[#0F5B8C]" />
                        </div>
                        <div>
                            <h2 className="font-bold text-[#0A2A44]">Ajukan Pembayaran</h2>
                            <p className="text-sm text-gray-500">Pilih tagihan yang ingin dibayar</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Pilih Tagihan */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Tagihan
                            </label>
                            <select
                                required
                                className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0F5B8C]"
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

                        {/* Preview Nominal */}
                        {selectedBill && (
                            <div className="bg-[#E6F0F9] rounded-xl p-4 flex items-center justify-between">
                                <span className="text-sm text-[#0F5B8C]">Total Pembayaran</span>
                                <span className="text-xl font-bold text-[#0F5B8C]">
                                    Rp {(selectedBill.usage_value * selectedBill.price).toLocaleString("id-ID")}
                                </span>
                            </div>
                        )}

                        {/* Metode Pembayaran */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Metode Pembayaran
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {PAYMENT_METHODS.map(pm => (
                                    <button
                                        key={pm.value}
                                        type="button"
                                        onClick={() => setMethod(pm.value)}
                                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                                            method === pm.value
                                                ? "border-[#0F5B8C] bg-[#E6F0F9] text-[#0F5B8C]"
                                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                                        }`}
                                    >
                                        {pm.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ✅ Upload Bukti Pembayaran — field baru */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Bukti Pembayaran <span className="text-red-500">*</span>
                            </label>

                            {!proofPreview ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#0F5B8C] hover:bg-[#E6F0F9]/30 transition-all"
                                >
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-gray-600">Klik untuk upload foto bukti</p>
                                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — Maks. 2MB</p>
                                </div>
                            ) : (
                                <div className="relative rounded-xl overflow-hidden border-2 border-[#0F5B8C]">
                                    <img
                                        src={proofPreview}
                                        alt="Bukti pembayaran"
                                        className="w-full max-h-48 object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveFile}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                        ✕
                                    </button>
                                    <div className="p-2 bg-[#E6F0F9] flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-[#0F5B8C]" />
                                        <span className="text-xs text-[#0F5B8C] font-medium truncate">
                                            {proofFile?.name}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        {/* Catatan */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Catatan <span className="text-gray-400 font-normal">(opsional)</span>
                            </label>
                            <textarea
                                rows={2}
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                placeholder="Contoh: Transfer via BCA atas nama Budi"
                                className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#0F5B8C] resize-none"
                            />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Memproses..." : "Ajukan Pembayaran"}
                        </Button>
                    </form>
                </div>
            ) : (
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <p className="font-bold text-emerald-800">Semua tagihan telah dibayar!</p>
                    <p className="text-sm text-emerald-600 mt-1">Tidak ada tagihan yang perlu dibayar saat ini.</p>
                </div>
            )}

            {/* Riwayat Pembayaran */}
            <div>
                <h2 className="font-bold text-[#0A2A44] mb-4">Riwayat Pembayaran</h2>
                {myPayments.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-2xl border-2 border-[#C2D9F0]">
                        <Wallet className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Belum ada riwayat pembayaran</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {myPayments.map(payment => (
                            <div
                                key={payment.id}
                                className="bg-white border-2 border-[#C2D9F0] rounded-xl p-4 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#E6F0F9] rounded-lg flex items-center justify-center">
                                        <Receipt className="w-5 h-5 text-[#0F5B8C]" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-[#0A2A44]">
                                            Rp {payment.amount.toLocaleString("id-ID")}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {payment.payment_method.replace(/_/g, " ")} ·{" "}
                                            {new Date(payment.createdAt).toLocaleDateString("id-ID")}
                                        </p>
                                    </div>
                                </div>
                                <StatusBadge status={payment.status} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}