"use client"

import { Admin } from "../../types"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { getCookie } from "cookies-next/client"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"

const DeleteCustomer = ({ selectedData }: { selectedData: Admin }) => {

    const [open, setOpen] = useState<boolean>(false)

    const handleSubmit = async (e: FormEvent) => {
        try {
            const token = await getCookie("accessToken")
            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/${selectedData.id}`

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
                    <Button variant="destructive">Delete</Button>
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Admin Data</DialogTitle>
                            <DialogDescription>Are you sure you want to delete {selectedData.name} data? Press Confirm if you do.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" variant="destructive">Confirm</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DeleteCustomer