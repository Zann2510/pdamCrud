import { Customer } from "../../types"
import { getCookies } from "../../../lib/server-cookies"
import { DataCard } from "../../../components/ui/datacard"
import { User, Droplets, FileText, CreditCard, Hash, Phone, MapPin } from "lucide-react"

type ResultData = {
    success: boolean
    message: string
    data: Customer
}

async function getCustomerProfile(): Promise<Customer | null> {
    try {
        const token = await getCookies("accessToken")
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/customers/me`, {
            method: "GET",
            headers: {
                "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        })
        const data: ResultData = await res.json()
        if (!res.ok) return null
        return data.data
    } catch { return null }
}

export default async function DashboardCustomer() {
    const customer = await getCustomerProfile()

    if (!customer) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Droplets className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-lg">Data pelanggan tidak ditemukan.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#0F5B8C] to-[#2B7CB0] rounded-2xl p-8 text-white shadow-md">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[#E6F0F9]/80 text-base">Selamat datang,</p>
                        <h1 className="text-3xl font-bold mt-0.5">{customer.name}</h1>
                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                            <span className="flex items-center gap-1.5 text-sm text-[#E6F0F9]">
                                <Hash className="w-3.5 h-3.5" />
                                {customer.customer_number}
                            </span>
                            <span className="flex items-center gap-1.5 text-sm bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                                Aktif
                            </span>
                        </div>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl hidden sm:block">
                        <Droplets className="w-10 h-10 text-white" />
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {
                        label: "Paket Layanan",
                        value: customer.service.name,
                        icon: <Droplets className="w-5 h-5" />,
                        bg: "bg-[#E6F0F9]", text: "text-[#0F5B8C]"
                    },
                    {
                        label: "Tarif Layanan",
                        value: `Rp ${customer.service.price.toLocaleString("id-ID")}`,
                        icon: <CreditCard className="w-5 h-5" />,
                        bg: "bg-emerald-50", text: "text-emerald-600"
                    },
                    {
                        label: "Batas Pemakaian",
                        value: `${customer.service.max_usage} m³`,
                        icon: <FileText className="w-5 h-5" />,
                        bg: "bg-amber-50", text: "text-amber-600"
                    },
                    {
                        label: "Min Pemakaian",
                        value: `${customer.service.min_usage} m³`,
                        icon: <FileText className="w-5 h-5" />,
                        bg: "bg-purple-50", text: "text-purple-600"
                    },
                ].map(item => (
                    <div key={item.label} className="bg-white border-2 border-[#C2D9F0] rounded-xl p-4 hover:shadow-md transition-all">
                        <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center ${item.text} mb-3`}>
                            {item.icon}
                        </div>
                        <p className="text-sm text-gray-500 mb-0.5">{item.label}</p>
                        <p className="font-bold text-[#0A2A44] text-base">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Detail Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Info Akun */}
                <DataCard title="Informasi Akun" icon={<User className="w-4 h-4" />}>
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#0F5B8C] to-[#2B7CB0] rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                            {customer.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-lg">{customer.name}</p>
                            <p className="text-sm text-gray-500">@{customer.user.username}</p>
                        </div>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2.5 text-gray-600">
                            <Hash className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span>{customer.customer_number}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-start gap-2.5 text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                            <span>{customer.address}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-400">
                                Terdaftar sejak:{" "}
                                {new Date(customer.createdAt).toLocaleDateString("id-ID", {
                                    year: "numeric", month: "long", day: "numeric"
                                })}
                            </p>
                        </div>
                    </div>
                </DataCard>

                {/* Info Langganan */}
                <DataCard title="Informasi Langganan" icon={<Droplets className="w-4 h-4" />}>
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs text-gray-500 mb-1">Nama Paket</p>
                            <p className="font-semibold text-gray-900 text-lg">{customer.service.name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500 mb-1">Min Pemakaian</p>
                                <p className="font-semibold text-gray-900">{customer.service.min_usage} m³</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500 mb-1">Max Pemakaian</p>
                                <p className="font-semibold text-gray-900">{customer.service.max_usage} m³</p>
                            </div>
                        </div>
                        <div className="bg-[#E6F0F9] rounded-xl p-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-[#0F5B8C]/70 mb-0.5">Total Tarif</p>
                                <p className="text-xl font-bold text-[#0F5B8C]">
                                    Rp {customer.service.price.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <CreditCard className="w-8 h-8 text-[#0F5B8C]/40" />
                        </div>
                    </div>
                </DataCard>
            </div>
        </div>
    )
}