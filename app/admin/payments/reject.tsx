// app/admin/payments/reject.tsx
"use client"

import { Payment } from "../../types"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { getCookie } from "cookies-next/client"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"
import { XCircle } from "lucide-react"  // ← ganti dari CheckCircle

const RejectPayment = ({ payment }: { payment: Payment }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const token = await getCookie("accessToken")
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/payments/${payment.id}/reject`, // ← GANTI dari /approve
                {
                    method: "PATCH",
                    headers: {
                        "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
            const result = await res.json()
            if (result?.success) {
                setOpen(false)
                toast.success("Pembayaran berhasil ditolak")
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast.warning(result.message)
            }
        } catch {
            toast.error("Terjadi kesalahan. Coba lagi.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                    <XCircle className="w-4 h-4 mr-1" /> Tolak
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Tolak Pembayaran</DialogTitle>
                        <DialogDescription>
                            Tolak pembayaran sebesar{" "}
                            <strong>Rp {payment.amount.toLocaleString("id-ID")}</strong>{" "}
                            dari <strong>{payment.customer?.name}</strong>?
                            Customer perlu mengajukan pembayaran ulang.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Batal</Button>
                        </DialogClose>
                        <Button type="submit" variant="destructive">
                            Ya, Tolak
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default RejectPayment