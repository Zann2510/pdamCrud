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

// ✅ FIX: Nama komponen diperbaiki dari ResetPasswordCustomer → ResetPasswordAdmin
const ResetPasswordAdmin = ({ selectedData }: { selectedData: Admin }) => {
    const router = useRouter()

    const [open, setOpen] = useState<boolean>(false)
    // ✅ FIX #2: Password selalu kosong — tidak di-prefill dari API
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    // ✅ QUALITY: Loading state
    const [loading, setLoading] = useState<boolean>(false)

    const openModal = () => {
        setOpen(true)
        setPassword("") // ✅ Tidak pakai selectedData.user.password
        setConfirmPassword("")
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!password.trim()) {
            toast.warning("Password tidak boleh kosong")
            return
        }
        if (password !== confirmPassword) {
            toast.warning("Konfirmasi password tidak cocok")
            return
        }
        if (password.length < 6) {
            toast.warning("Password minimal 6 karakter")
            return
        }

        setLoading(true)
        try {
            const token = await getCookie("accessToken")
            const url = `/api/backend/admins/${selectedData.id}`

            const response = await fetch(url, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
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
                    <Button onClick={openModal} variant="secondary">Reset Password</Button>
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Reset Password Admin</DialogTitle>
                            <DialogDescription>
                                Masukkan password baru untuk <strong>{selectedData.name}</strong>.
                            </DialogDescription>
                        </DialogHeader>

                        {/* ✅ BUG FIX: DialogFooter di luar FieldGroup */}
                        <FieldGroup className="my-4">
                            <Field>
                                <label htmlFor="reset-admin-password">Password Baru</label>
                                <Input
                                    id="reset-admin-password"
                                    name="password"
                                    type="password"
                                    placeholder="Masukkan password baru"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Field>
                            <Field>
                                <label htmlFor="reset-admin-confirm">Konfirmasi Password</label>
                                <Input
                                    id="reset-admin-confirm"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Ulangi password baru"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
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

export default ResetPasswordAdmin