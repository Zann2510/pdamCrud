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

const EditAdmin = ({ selectedData }: { selectedData: Admin }) => {
    const router = useRouter()

    const [open, setOpen] = useState<boolean>(false)
    const [password, setPassword] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [phone, setPhone] = useState<string>("")

    const openModal = () => {
        setOpen(true)
        setPassword(selectedData.user.password)
        setName(selectedData.name)
        setPhone(selectedData.phone)
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()

            const token = await getCookie("accessToken")
            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/${selectedData.id}`
            const payload = JSON.stringify({ password, name, phone })

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
                            <DialogTitle>Edit Admin Data</DialogTitle>
                            <DialogDescription>
                                Make changes to your admin here. Click Save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Field>
                                <label htmlFor="name">Nama</label>
                                <Input id="name" name="name" type="text" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} />
                            </Field>
                            <Field>
                                <label htmlFor="password">Password</label>
                                <Input id="password" name="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Field>
                            <Field>
                                <label htmlFor="phone">No. Telepon</label>
                                <Input id="phone" name="phone" type="text" placeholder="No. Telepon" value={phone} onChange={(e) => setPhone(e.target.value)} />
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

export default EditAdmin