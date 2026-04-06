"use client"

import { Customer } from "../../types"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { Field, FieldGroup } from "../../../components/ui/field"
import { Input } from "../../../components/ui/input"
import { getCookie } from "cookies-next/client"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"

const AddBill = ({ customers }: { customers: Customer[] }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [customer_id, setCustomerId] = useState<number>(0)
    const [usage_value, setUsageValue] = useState<number>(0)
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
    const [year, setYear] = useState<number>(new Date().getFullYear())

    const openModal = () => {
        setOpen(true)
        setCustomerId(0)
        setUsageValue(0)
        setMonth(new Date().getMonth() + 1)
        setYear(new Date().getFullYear())
    }

    // Helper: konversi input type="month" (yyyy-MM) → month + year
    const periodValue = `${year}-${String(month).padStart(2, "0")}`
    const handlePeriodChange = (val: string) => {
        const [y, m] = val.split("-")
        setYear(Number(y))
        setMonth(Number(m))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (customer_id === 0) {
            toast.warning("Pilih pelanggan terlebih dahulu.")
            return
        }
        try {
            const token = await getCookie("accessToken")
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/bills`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`
                },
                // ✅ Kirim field sesuai Bill type: usage_value, month, year
                body: JSON.stringify({ customer_id, usage_value, month, year })
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
                <Button onClick={openModal}>Buat Tagihan</Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Buat Tagihan Baru</DialogTitle>
                        <DialogDescription>
                            Input pemakaian air pelanggan untuk periode tertentu.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="mt-4">
                        <Field>
                            <label htmlFor="customer">Pelanggan</label>
                            <select
                                id="customer"
                                required
                                className="w-full border rounded-lg p-2 text-sm"
                                value={customer_id}
                                onChange={(e) => setCustomerId(Number(e.target.value))}
                            >
                                <option value={0}>Pilih Pelanggan</option>
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} — {c.customer_number}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field>
                            <label htmlFor="period">Periode (Bulan)</label>
                            <Input
                                id="period"
                                type="month"
                                required
                                value={periodValue}
                                onChange={(e) => handlePeriodChange(e.target.value)}
                            />
                        </Field>
                        <Field>
                            <label htmlFor="usage_value">Pemakaian (m³)</label>
                            <Input
                                id="usage_value"
                                type="number"
                                min={0}
                                required
                                placeholder="Contoh: 15"
                                value={usage_value}
                                onChange={(e) => setUsageValue(Number(e.target.value))}
                            />
                        </Field>
                    </FieldGroup>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Batal</Button>
                        </DialogClose>
                        <Button type="submit">Simpan</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddBill