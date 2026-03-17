"use client"

import { Button } from "../../../components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { Field, FieldGroup } from "../../../components/ui/field"
import { Input } from "../../../components/ui/input"
import { getCookie } from "cookies-next/client"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"

const AddService = () => {
    const router = useRouter()

    const [isShow, setIsShow] = useState<boolean>(false)
    const [name, setName] = useState<string>("")
    const [min_usage, setMinUsage] = useState<number>(0)
    const [max_usage, setMaxUsage] = useState<number>(0)
    const [price, setPrice] = useState<number>(0)

    const openModal = () => {
        setName("")
        setMinUsage(0)
        setMaxUsage(0)
        setPrice(0)
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()

            const token = await getCookie("accessToken")
            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/services`
            const payload = JSON.stringify({ name, min_usage, max_usage, price })

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`
                },
                body: payload
            })

            const result = await response.json()
            if (result?.success) {
                // ✅ FIX: Hapus setIsShow(false) yang duplikat
                // Sebelumnya dipanggil 2x berturut-turut tanpa alasan
                setIsShow(false)
                toast.success(result?.message)
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast.warning(result?.message)
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    return (
        <div>
            <Dialog open={isShow} onOpenChange={setIsShow}>
                <DialogTrigger asChild>
                    <Button onClick={openModal} variant="default">Add Service Data</Button>
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Add Service Data</DialogTitle>
                            <DialogDescription>
                                Isi data service baru di bawah ini. Klik Save jika sudah selesai.
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Field>
                                <label htmlFor="name">Name</label>
                                <Input id="name" name="name" type="text" placeholder="Service Name" value={name} onChange={(e) => setName(e.target.value)} required />
                            </Field>
                            <Field>
                                <label htmlFor="price">Price</label>
                                <Input id="price" name="price" type="text"  value={Number(price)} onChange={(e) => setPrice(Number(e.target.value))} />
                            </Field>
                            <Field>
                                <label htmlFor="min_usage">Minimum Usage</label>
                                <Input id="min_usage" name="min_usage" type="text"  value={Number(min_usage)} onChange={(e) => setMinUsage(Number(e.target.value))} />
                            </Field>
                            <Field>
                                <label htmlFor="max_usage">Maximum Usage</label>
                                <Input id="max_usage" name="max_usage" type="text"  value={Number(max_usage)} onChange={(e) => setMaxUsage(Number(e.target.value))} />
                            </Field>
                        </FieldGroup>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button variant="outline" type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddService