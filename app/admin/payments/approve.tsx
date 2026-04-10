"use client"

import { Payment } from "../../types"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { getCookie } from "cookies-next/client"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"
import { CheckCircle } from "lucide-react"

const ApprovePayment = ({ payment }: { payment: Payment }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const token = await getCookie("accessToken")
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/payments/${payment.id}/approve`,
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
                    <CheckCircle className="w-4 h-4 mr-1" /> Setujui
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Setujui Pembayaran</DialogTitle>
                        <DialogDescription>
                            Konfirmasi pembayaran sebesar{" "}
                            <strong>Rp {payment.amount.toLocaleString("id-ID")}</strong>{" "}
                            dari <strong>{payment.customer?.name}</strong>?
                            Bill terkait akan otomatis ditandai lunas.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Batal</Button>
                        </DialogClose>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                            Ya, Setujui
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ApprovePayment