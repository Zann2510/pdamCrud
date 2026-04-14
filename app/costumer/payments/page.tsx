import { Bill, Payment } from "../../types"
import { getCookies } from "../../../lib/server-cookies"
import { PageHeader } from "../../../components/ui/pageheader"
import PaymentForm from "./form"

async function getUnpaidBills(): Promise<Bill[]> {
    try {
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
        return (data.data as Bill[]).filter(b => !b.paid)
    } catch {
        return []
    }
}

async function getMyPayments(): Promise<Payment[]> {
    try {
        const token = await getCookies("accessToken")
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/payments/me`, {
            headers: {
                "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        })
        const data = await res.json()
        if (!res.ok) return []

        // === MAPPING DATA API KE BENTUK FRONTEND ===
        return data.data.map((item: any) => {
            let mappedStatus = "PENDING";
            // Jika verified dari API adalah true, ubah jadi APPROVED
            if (item.verified === true) {
                mappedStatus = "APPROVED";
            }

            return {
                ...item,
                amount: item.total_amount || 0, // Ambil nominal dari total_amount API
                status: mappedStatus,           // Masukkan status yang sudah diterjemahkan
                createdAt: item.createdAt || new Date().toISOString()
            } as Payment;
        });

    } catch {
        return []
    }
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