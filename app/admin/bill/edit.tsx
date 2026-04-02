"use client"

import { Bill } from "../../types"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { Field, FieldGroup } from "../../../components/ui/field"
import { Input } from "../../../components/ui/input"
import { getCookie } from "cookies-next/client"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"

const EditBill = ({ selectedData }: { selectedData: Bill }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [usageValue, setUsageValue] = useState<number>(0)
    // ✅ month dan year terpisah
    const [month, setMonth] = useState<number>(1)
    const [year, setYear] = useState<number>(new Date().getFullYear())

    const openModal = () => {
        setOpen(true)
        // ✅ Gunakan field API yang benar
        setUsageValue(selectedData.usage_value)
        setMonth(selectedData.month)
        setYear(selectedData.year)
    }

    // ✅ Helper untuk format input type="month" (yyyy-MM)
    const periodValue = `${year}-${String(month).padStart(2, "0")}`

    const handlePeriodChange = (val: string) => {
        const [y, m] = val.split("-")
        setYear(Number(y))
        setMonth(Number(m))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const token = await getCookie("accessToken")
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/bills/${selectedData.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`
                },
                // ✅ Kirim field sesuai API
                body: JSON.stringify({ usage_value: usageValue, month, year })
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
                <Button onClick={openModal} variant="secondary">Edit</Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Tagihan</DialogTitle>
                        <DialogDescription>
                            Ubah data tagihan untuk <strong>{selectedData.customer?.name}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="mt-4">
                        <Field>
                            <label htmlFor="period">Periode (Bulan)</label>
                            <Input
                                id="period"
                                type="month"
                                value={periodValue}
                                onChange={(e) => handlePeriodChange(e.target.value)}
                            />
                        </Field>
                        <Field>
                            <label htmlFor="usage">Pemakaian (m³)</label>
                            <Input
                                id="usage"
                                type="number"
                                min={0}
                                value={usageValue}
                                onChange={(e) => setUsageValue(Number(e.target.value))}
                            />
                        </Field>
                    </FieldGroup>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Batal</Button>
                        </DialogClose>
                        <Button type="submit">Simpan Perubahan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditBill