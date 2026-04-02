"use client"

import { Bill } from "../../types"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { getCookie } from "cookies-next/client"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"

const DeleteBill = ({ selectedData }: { selectedData: Bill }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const token = await getCookie("accessToken")
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/bills/${selectedData.id}`, {
                method: "DELETE",
                headers: {
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`
                }
            })
            const result = await res.json()
            if (result?.success) {
                setOpen(false)
                toast.success(result.message)
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
                <Button variant="default">Hapus</Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Hapus Tagihan</DialogTitle>
                        <DialogDescription>
                            Hapus tagihan <strong>{selectedData.customer?.name}</strong> periode{" "}
                            <strong>
                                {/* ✅ Gunakan month + year bukan period */}
                                {new Date(selectedData.year, selectedData.month - 1).toLocaleDateString("id-ID", {
                                    month: "long",
                                    year: "numeric"
                                })}
                            </strong>
                            ? Aksi ini tidak bisa dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Batal</Button>
                        </DialogClose>
                        <Button type="submit" variant="outline">Hapus</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteBill