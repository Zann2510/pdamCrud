"use client"

import { Bill } from "../../types"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { getCookie } from "cookies-next/client"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const DeleteBill = ({ selectedData }: { selectedData: Bill }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    // ✅ QUALITY: Loading state untuk cegah double-click
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = await getCookie("accessToken")
            const res = await fetch(`/api/backend/bills/${selectedData.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
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
        } finally {
            setLoading(false)
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
                                {new Date(selectedData.year, selectedData.month - 1).toLocaleDateString("id-ID", {
                                    month: "long", year: "numeric"
                                })}
                            </strong>
                            ? Aksi ini tidak bisa dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline" type="button" disabled={loading}>Batal</Button>
                        </DialogClose>
                        <Button type="submit" variant="destructive" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                            {loading ? "Menghapus..." : "Hapus"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteBill