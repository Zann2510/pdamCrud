"use client"

import { Payment } from "../../types"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { getCookie } from "cookies-next/client"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"
import { CheckCircle } from "lucide-react"

const VerifyPayment = ({ payment }: { payment: Payment }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const token = await getCookie("accessToken")

            // ✅ Sesuai Postman: PATCH /payments/:id — tanpa body
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/payments/${payment.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                        "Authorization": `Bearer ${token}`
                    }
                    // ✅ Tidak perlu body sama sekali
                }
            )
            const result = await res.json()
            if (result?.success) {
                setOpen(false)
                toast.success("Pembayaran berhasil diverifikasi")
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
                <Button variant="default" className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <CheckCircle className="w-4 h-4 mr-1" /> Verifikasi
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Verifikasi Pembayaran</DialogTitle>
                        <DialogDescription>
                            Konfirmasi pembayaran dari{" "}
                            <strong>{payment.customer?.name}</strong>?
                            Bill terkait akan otomatis ditandai lunas.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Batal</Button>
                        </DialogClose>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                            Ya, Verifikasi
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default VerifyPayment