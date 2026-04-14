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
import { Loader2 } from "lucide-react"

const EditService = ({ selectedData }: { selectedData: Services }) => {
    const router = useRouter()

    const [open, setOpen] = useState<boolean>(false)
    const [name, setName] = useState<string>("")
    const [min_usage, setMinUsage] = useState<number>(0)
    const [max_usage, setMaxUsage] = useState<number>(0)
    const [price, setPrice] = useState<number>(0)
    // ✅ QUALITY: Loading state
    const [loading, setLoading] = useState<boolean>(false)

    const openModal = () => {
        setOpen(true)
        setName(selectedData.name)
        setMinUsage(selectedData.min_usage)
        setMaxUsage(selectedData.max_usage)
        setPrice(selectedData.price)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = await getCookie("accessToken")

            const response = await fetch(`/api/backend/services/${selectedData.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, min_usage, max_usage, price })
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
        } finally {
            setLoading(false)
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

                        {/* ✅ BUG FIX: DialogFooter dipindah ke LUAR FieldGroup */}
                        <FieldGroup className="my-4">
                            <Field>
                                <label htmlFor="edit-svc-name">Name</label>
                                <Input id="edit-svc-name" name="name" type="text" placeholder="Service Name" value={name} onChange={(e) => setName(e.target.value)} />
                            </Field>
                            <Field>
                                <label htmlFor="edit-svc-price">Price (Rp/m³)</label>
                                <Input id="edit-svc-price" name="price" type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                            </Field>
                            <Field>
                                <label htmlFor="edit-svc-min">Minimum Usage (m³)</label>
                                <Input id="edit-svc-min" name="min_usage" type="number" min={0} value={min_usage} onChange={(e) => setMinUsage(Number(e.target.value))} />
                            </Field>
                            <Field>
                                <label htmlFor="edit-svc-max">Maximum Usage (m³)</label>
                                <Input id="edit-svc-max" name="max_usage" type="number" min={0} value={max_usage} onChange={(e) => setMaxUsage(Number(e.target.value))} />
                            </Field>
                        </FieldGroup>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" type="button" disabled={loading}>Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
                                {loading ? "Menyimpan..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditService