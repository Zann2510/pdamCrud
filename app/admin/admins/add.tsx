"use client"

import { getCookie } from "cookies-next"
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from "react"
import { toast } from "sonner"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { Field, FieldGroup } from "../../../components/ui/field"
import { Input } from "../../../components/ui/input"
import { Loader2 } from "lucide-react"

const AddAdmin = () => {
    const router = useRouter()

    const [open, setOpen] = useState<boolean>(false)
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [phone, setPhone] = useState<string>("")
    // ✅ QUALITY: Tambah loading state
    const [loading, setLoading] = useState<boolean>(false)

    const openModal = () => {
        setOpen(true)
        setUsername("")
        setPassword("")
        setName("")
        setPhone("")
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = await getCookie("accessToken")
            // ✅ Gunakan proxy — APP-KEY ditambahkan server-side
            const response = await fetch(`/api/backend/admins`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ username, password, name, phone })
            })

            const result = await response.json()
            if (result?.success) {
                setOpen(false)
                toast.success(result?.message)
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast.warning(result?.message)
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button onClick={openModal} variant="default">Add Admin Data</Button>
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Add Admin Data</DialogTitle>
                            <DialogDescription>
                                Isi data admin baru di bawah ini. Klik Save jika sudah selesai.
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup className="my-4">
                            <Field>
                                <label htmlFor="add-admin-username">Username</label>
                                <Input id="add-admin-username" name="username" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            </Field>
                            <Field>
                                <label htmlFor="add-admin-password">Password</label>
                                <Input id="add-admin-password" name="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </Field>
                            <Field>
                                <label htmlFor="add-admin-name">Nama</label>
                                <Input id="add-admin-name" name="name" type="text" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} required />
                            </Field>
                            <Field>
                                <label htmlFor="add-admin-phone">No. Telepon</label>
                                <Input id="add-admin-phone" name="phone" type="text" placeholder="No. Telepon" value={phone} onChange={(e) => setPhone(e.target.value)} required />
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

export default AddAdmin