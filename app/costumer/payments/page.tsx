import { Bill, Payment } from "../../types"
import { getCookies } from "../../../lib/server-cookies"
import { PageHeader } from "../../../components/ui/pageheader"
import PaymentForm from "./form"


async function getUnpaidBills(): Promise<Bill[]> {
    const token = await getCookies("accessToken")
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/bills/me`, {
        headers: {
            "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
            "Authorization": `Bearer ${token}`
        },
        cache: "no-store"
    })
    const data = await res.json()
    if (!res.ok) return []
    // Filter hanya yang belum dibayar
    return (data.data as Bill[]).filter(b => !b.paid)
}

async function getMyPayments(): Promise<Payment[]> {
    const token = await getCookies("accessToken")
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/payments/me`, {
        headers: {
            "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
            "Authorization": `Bearer ${token}`
        },
        cache: "no-store"
    })
    const data = await res.json()
    return res.ok ? data.data : []
}

export default async function CustomerPaymentsPage() {
    const [unpaidBills, myPayments] = await Promise.all([
        getUnpaidBills(),
        getMyPayments()
    ])

    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader
                title="Pembayaran"
                description="Bayar tagihan air Anda di sini"
            />
            <PaymentForm unpaidBills={unpaidBills} myPayments={myPayments} />
        </div>
    )
}