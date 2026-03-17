"use client"

import { Customer } from "../../types"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { getCookie } from "cookies-next/client"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"

const DeleteCustomer = ({ selectedData }: { selectedData: Customer }) => {
    const router = useRouter()
    const [open, setOpen] = useState<boolean>(false)

    const handleSubmit = async (e: FormEvent) => {
        // ✅ FIX: e.preventDefault() mencegah halaman reload saat form disubmit
        e.preventDefault()

        try {
            const token = await getCookie("accessToken")
            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers/${selectedData.id}`

            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`
                }
            })

            const result = await response.json()
            if (result?.success) {
                setOpen(false)
                toast.success(result.message)
                // ✅ Tambahan: refresh data setelah delete
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast.warning(result.message)
            }
        } catch (error) {
            toast.error(`Something went wrong: ${error}`)
        }
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="default">Delete</Button>
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Hapus Customer</DialogTitle>
                            <DialogDescription>
                                Apakah kamu yakin ingin menghapus data <strong>{selectedData.name}</strong>? Aksi ini tidak bisa dibatalkan.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" variant="outline">Confirm</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DeleteCustomer