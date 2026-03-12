import { getCookies } from "../../../lib/server-cookies"
import { Users, UserCog, Droplets, Activity } from "lucide-react"
import { Admin } from "../../types"
import { StatCard } from "../../../components/ui/statcard"
import { DataCard } from "../../../components/ui/datacard"

// Fetch semua data secara paralel untuk performa lebih baik
async function getAdminProfile(): Promise<Admin | null> {
    try {
        const token = await getCookies("accessToken")
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/me`, {
            headers: { "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "", "Authorization": `Bearer ${token}` },
            cache: "no-store"
        })
        const data = await res.json()
        return res.ok ? data.data : null
    } catch { return null }
}

async function getCount(endpoint: string): Promise<number> {
    try {
        const token = await getCookies("accessToken")
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/${endpoint}?page=1&quantity=1`, {
            headers: { "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "", "Authorization": `Bearer ${token}` },
            cache: "no-store"
        })
        const data = await res.json()
        return res.ok ? (data.count ?? 0) : 0
    } catch { return 0 }
}

export default async function DashboardPage() {
    // Promise.all → semua fetch jalan paralel, bukan berurutan
    const [admin, customerCount, adminCount, serviceCount] = await Promise.all([
        getAdminProfile(),
        getCount("customers"),
        getCount("admins"),
        getCount("services"),
    ])

    const stats = [
        { title: "Total Customers", value: customerCount, icon: <Users className="w-5 h-5" />, color: "blue" as const, href: "/admin/customers" },
        { title: "Total Admins", value: adminCount, icon: <UserCog className="w-5 h-5" />, color: "green" as const, href: "/admin/admins" },
        { title: "Total Services", value: serviceCount, icon: <Droplets className="w-5 h-5" />, color: "orange" as const, href: "/admin/services" },
    ]

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            {/* Greeting Banner */}
            <div className="bg-gradient-to-r from-[#0F5B8C] to-[#2B7CB0] rounded-xl p-6 text-white shadow">
                <p className="text-[#E6F0F9] text-sm">Selamat datang kembali,</p>
                <h1 className="text-2xl font-bold mt-0.5">{admin?.name ?? "Admin"} 👋</h1>
                <p className="text-[#E6F0F9] text-sm mt-2">
                    Berikut ringkasan data sistem PDAM hari ini.
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {stats.map(s => (
                    <StatCard key={s.title} {...s} />
                ))}
            </div>

            {/* Detail Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Info Akun */}
                <DataCard title="Info Akun Saya" icon={<UserCog className="w-4 h-4" />}>
                    {admin ? (
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#0F5B8C] to-[#2B7CB0] rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                                {admin.name?.charAt(0) ?? "A"}
                            </div>
                            <div className="space-y-1">
                                <p className="font-semibold text-gray-900">{admin.name}</p>
                                <p className="text-sm text-gray-500">@{admin.user.username}</p>
                                <p className="text-sm text-gray-500">{admin.phone}</p>
                                <span className="inline-block text-xs bg-[#E6F0F9] text-[#0F5B8C] px-2 py-0.5 rounded-full font-medium">
                                    Administrator
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">Data tidak tersedia</p>
                    )}
                </DataCard>

                {/* Ringkasan Sistem */}
                <DataCard title="Ringkasan Sistem" icon={<Activity className="w-4 h-4" />}>
                    <div className="space-y-3">
                        {[
                            { label: "Total Customers", value: customerCount, color: "bg-[#0F5B8C]" },
                            { label: "Total Admins", value: adminCount, color: "bg-emerald-500" },
                            { label: "Total Services", value: serviceCount, color: "bg-amber-500" },
                        ].map(item => (
                            <div key={item.label}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">{item.label}</span>
                                    <span className="font-semibold text-gray-900">{item.value}</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color} rounded-full transition-all duration-700`}
                                        style={{ width: item.value > 0 ? `${Math.min((item.value / Math.max(customerCount, 1)) * 100, 100)}%` : "5%" }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </DataCard>
            </div>
        </div>
    )
}