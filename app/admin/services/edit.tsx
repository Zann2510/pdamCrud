"use client"

import { Services } from "../../types"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { Field, FieldGroup } from "../../../components/ui/field"
import { Input } from "../../../components/ui/input"
import { getCookie } from "cookies-next/client"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"

const EditService = ({ selectedData }: { selectedData: Services }) => {
    const router = useRouter()

    const [open, setOpen] = useState<boolean>(false)
    const [name, setName] = useState<string>("")
    const [min_usage, setMinUsage] = useState<number>(0)
    const [max_usage, setMaxUsage] = useState<number>(0)
    const [price, setPrice] = useState<number>(0)

    const openModal = () => {
        setName(selectedData.name)
        setMinUsage(selectedData.min_usage)
        setMaxUsage(selectedData.max_usage)
        setPrice(selectedData.price)
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()

            const token = await getCookie("accessToken")
            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/services/${selectedData.id}`
            const payload = JSON.stringify({ name, min_usage, max_usage, price })

            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    Authorization: `Bearer ${token}`
                },
                body: payload
            })

            const result = await response.json()
            if (result?.success) {
                setOpen(false)
                toast.success(result.message)
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast.warning(result.message)
            }
        } catch (error) {
            toast.error(`Something went wrong, ${error}`)
        }
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button onClick={openModal} variant="secondary">Edit</Button>
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Edit Service Data</DialogTitle>
                            <DialogDescription>
                                Make changes to your service here. Click Save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Field>
                                <label htmlFor="name">Name</label>
                                <Input id="name" name="name" type="text" placeholder="Service Name" value={name} onChange={(e) => setName(e.target.value)} />
                            </Field>
                            <Field>
                                <label htmlFor="price">Price</label>
                                <Input id="price" name="price" type="number" placeholder="0" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                            </Field>
                            <Field>
                                <label htmlFor="min_usage">Minimum Usage</label>
                                <Input id="min_usage" name="min_usage" type="number" placeholder="0" value={min_usage} onChange={(e) => setMinUsage(Number(e.target.value))} />
                            </Field>
                            <Field>
                                <label htmlFor="max_usage">Maximum Usage</label>
                                <Input id="max_usage" name="max_usage" type="number" placeholder="0" value={max_usage} onChange={(e) => setMaxUsage(Number(e.target.value))} />
                            </Field>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </FieldGroup>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditService