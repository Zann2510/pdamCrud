"use client"

import { Admin } from "../../types"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { Field, FieldGroup } from "../../../components/ui/field"
import { Input } from "../../../components/ui/input"
import { getCookie } from "cookies-next/client"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const EditAdmin = ({ selectedData }: { selectedData: Admin }) => {
    const router = useRouter()

    const [open, setOpen] = useState<boolean>(false)
    const [name, setName] = useState<string>("")
    const [phone, setPhone] = useState<string>("")
    // ✅ FIX #2: Password TIDAK di-prefill dari API
    // Password field dikosongkan — user harus isi baru jika ingin ganti
    const [password, setPassword] = useState<string>("")
    // ✅ QUALITY: Loading state agar tombol tidak bisa diklik berkali-kali
    const [loading, setLoading] = useState<boolean>(false)

    const openModal = () => {
        setOpen(true)
        setName(selectedData.name)
        setPhone(selectedData.phone)
        setPassword("") // ✅ Selalu kosong saat modal dibuka
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = await getCookie("accessToken")
            const url = `/api/backend/admins/${selectedData.id}`

            // ✅ Hanya sertakan password dalam payload jika user mengisinya
            const payload: Record<string, string> = { name, phone }
            if (password.trim()) payload.password = password

            const response = await fetch(url, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
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
                            <DialogTitle>Edit Admin Data</DialogTitle>
                            <DialogDescription>
                                Ubah data admin. Kosongkan password jika tidak ingin menggantinya.
                            </DialogDescription>
                        </DialogHeader>

                        {/* ✅ BUG FIX: DialogFooter dipindah ke LUAR FieldGroup */}
                        <FieldGroup className="my-4">
                            <Field>
                                <label htmlFor="edit-admin-name">Nama</label>
                                <Input id="edit-admin-name" name="name" type="text" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} />
                            </Field>
                            <Field>
                                <label htmlFor="edit-admin-password">
                                    Password Baru{" "}
                                    <span className="text-gray-400 font-normal text-xs">(opsional)</span>
                                </label>
                                <Input
                                    id="edit-admin-password"
                                    name="password"
                                    type="password"
                                    placeholder="Kosongkan jika tidak ingin ganti"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <label htmlFor="edit-admin-phone">No. Telepon</label>
                                <Input id="edit-admin-phone" name="phone" type="text" placeholder="No. Telepon" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </Field>
                        </FieldGroup>

                        {/* ✅ BUG FIX: DialogFooter di luar FieldGroup */}
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

export default EditAdmin