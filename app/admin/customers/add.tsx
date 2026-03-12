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

const AddCustomer = ({ serviceData }: { serviceData: Services[] }) => {
    const router = useRouter()

    const [open, setOpen] = useState<boolean>(false)
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [customer_number, setCustomerNumber] = useState<string>("")
    const [address, setAddress] = useState<string>("")
    const [phone, setPhone] = useState<string>("")
    const [service_id, setServiceID] = useState<number>(0)

    const openModal = () => {
        setOpen(true)
        setUsername("")
        setPassword("")
        setName("")
        setCustomerNumber("")
        setAddress("")
        setPhone("")
        setServiceID(0)
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()

            const token = await getCookie("accessToken")
            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers`
            const payload = JSON.stringify({ username, password, name, customer_number, address, phone, service_id })

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
                setOpen(false)
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
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button onClick={openModal} variant="default">Add Customer Data</Button>
                </DialogTrigger>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Add Customer Data</DialogTitle>
                            <DialogDescription>
                                Make changes to customers data in here. Click Save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Field>
                                <label htmlFor="username">Username</label>
                                <Input id="username" name="username" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </Field>
                            <Field>
                                <label htmlFor="password">Password</label>
                                <Input id="password" name="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Field>
                            <Field>
                                <label htmlFor="name">Nama</label>
                                <Input id="name" name="name" type="text" placeholder="Nama" value={name} onChange={(e) => setName(e.target.value)} />
                            </Field>
                            <Field>
                                <label htmlFor="customer_number">NIK</label>
                                <Input id="customer_number" name="customer_number" type="text" placeholder="NIK" value={customer_number} onChange={(e) => setCustomerNumber(e.target.value)} />
                            </Field>
                            <Field>
                                <label htmlFor="address">Alamat</label>
                                <Input id="address" name="address" type="textarea" placeholder="Alamat" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </Field>
                            <Field>
                                <label htmlFor="phone">No. Telepon</label>
                                <Input id="phone" name="phone" type="text" placeholder="No. Telepon" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </Field>
                            <Field>
                                <label htmlFor="service">Service</label>
                                <select className="w-full border rounded-lg p-2" value={service_id} onChange={(e) => setServiceID(Number(e.target.value))}>
                                    <option value="" className="">Select Service</option>
                                    {serviceData.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                            </Field>
                        </FieldGroup>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div >
    )
}

export default AddCustomer