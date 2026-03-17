import { getCookies } from "../../../lib/server-cookies"
import { Users, UserCog, Droplet, Activity, TrendingUp, Clock, Calendar, Bell, Phone, Shield } from "lucide-react"
import { Admin } from "../../types"
import { StatCard } from "../../../components/ui/statcard"
import { DataCard } from "../../../components/ui/datacard"
import Link from "next/link"
import { Button } from "../../../components/ui/button"

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

// Dummy data untuk aktivitas terbaru (bisa diganti dengan API real)
const recentActivities = [
    { id: 1, action: "Pelanggan baru ditambahkan", user: "Admin Budi", time: "5 menit yang lalu", icon: Users },
    { id: 2, action: "Pembayaran tagihan", user: "Ani (Pelanggan)", time: "15 menit yang lalu", icon: Droplet },
    { id: 3, action: "Admin baru terdaftar", user: "Siti", time: "1 jam yang lalu", icon: UserCog },
    { id: 4, action: "Update layanan", user: "Admin Dedi", time: "2 jam yang lalu", icon: TrendingUp },
]

export default async function DashboardPage() {
    const [admin, customerCount, adminCount, serviceCount] = await Promise.all([
        getAdminProfile(),
        getCount("customers"),
        getCount("admins"),
        getCount("services"),
    ])

    const stats = [
        { 
            title: "Total Pelanggan", 
            value: customerCount, 
            icon: <Users className="w-6 h-6" />, 
            color: "blue" as const, 
            href: "/admin/customers",
            trend: "+12% dari bulan lalu"
        },
        { 
            title: "Total Admin", 
            value: adminCount, 
            icon: <UserCog className="w-6 h-6" />, 
            color: "green" as const, 
            href: "/admin/admins",
            trend: "+2 minggu ini"
        },
        { 
            title: "Total Layanan", 
            value: serviceCount, 
            icon: <Droplet className="w-6 h-6" />, 
            color: "orange" as const, 
            href: "/admin/services",
            trend: serviceCount + " paket aktif"
        },
    ]

    const maxCount = Math.max(customerCount, adminCount, serviceCount, 1)

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in">
            {/* Greeting Banner - Diperbesar */}
            <div className="bg-gradient-to-r from-[#1E4A7A] to-[#0A2A44] rounded-2xl p-8 text-white shadow-xl border-2 border-[#C2D9F0]">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-[#E1EEFB] text-lg mb-2">
                            <Clock className="w-5 h-5" />
                            <span>{new Date().toLocaleDateString('id-ID', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            Selamat datang kembali, {admin?.name?.split(' ')[0] ?? "Admin"}! 👋
                        </h1>
                        <p className="text-xl text-[#E1EEFB] max-w-2xl">
                            Berikut ringkasan data sistem PDAM hari ini. Semoga harimu menyenangkan!
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-3">
                        <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-lg px-6 py-6 h-auto">
                            <Bell className="w-5 h-5 mr-2" />
                            Notifikasi
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stat Cards - Dengan ukuran lebih besar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 cursor-pointer hover:shadow-xl transition-all">
                {stats.map(s => (
                    <Link href={s.href} key={s.title} className="block">
                        <StatCard 
                            title={s.title} 
                            value={s.value} 
                            icon={s.icon}
                            color={s.color}
                            trend={s.trend}
                        />
                    </Link>
                ))}
            </div>

            {/* Detail Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Info Akun - Diperbesar */}
                <DataCard 
                    title="Profil Administrator" 
                    icon={<UserCog className="w-6 h-6" />}
                    action={<Link href="/admin/profile" className="text-[#1E4A7A] hover:underline text-base">Lihat Detail</Link>}
                >
                    {admin ? (
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            <div className="w-24 h-24 bg-gradient-to-br from-[#1E4A7A] to-[#0A2A44] rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg flex-shrink-0">
                                {admin.name?.charAt(0).toUpperCase() ?? "A"}
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-2xl font-bold text-[#0A2A44]">{admin.name}</p>
                                    <p className="text-lg text-gray-500">@{admin.user.username}</p>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone className="w-5 h-5" />
                                    <span className="text-lg">{admin.phone || "Belum diisi"}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center gap-2 bg-[#E1EEFB] text-[#1E4A7A] px-4 py-2 rounded-full text-base font-semibold">
                                        <Shield className="w-4 h-4" />
                                        Administrator
                                    </span>
                                    <span className="text-gray-400 text-base">
                                        Bergabung: {new Date(admin.createdAt).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-lg">Data tidak tersedia</p>
                    )}
                </DataCard>

                {/* Ringkasan Sistem dengan Progress Bar */}
                <DataCard 
                    title="Ringkasan Sistem" 
                    icon={<Activity className="w-6 h-6" />}
                >
                    <div className="space-y-5">
                        {[
                            { label: "Pelanggan", value: customerCount, color: "bg-[#1E4A7A]", icon: Users },
                            { label: "Administrator", value: adminCount, color: "bg-emerald-500", icon: UserCog },
                            { label: "Paket Layanan", value: serviceCount, color: "bg-amber-500", icon: Droplet },
                        ].map(item => {
                            const percentage = Math.min((item.value / maxCount) * 100, 100)
                            return (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <item.icon className="w-5 h-5 text-gray-500" />
                                            <span className="text-lg text-gray-700">{item.label}</span>
                                        </div>
                                        <span className="text-xl font-bold text-[#0A2A44]">{item.value}</span>
                                    </div>
                                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} rounded-full transition-all duration-700`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {percentage.toFixed(1)}% dari total {maxCount}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </DataCard>

                {/* Aktivitas Terbaru */}
                <DataCard 
                    title="Aktivitas Terbaru" 
                    icon={<Activity className="w-6 h-6" />}
                    className="lg:col-span-2"
                >
                    <div className="space-y-4">
                        {recentActivities.map((activity) => {
                            const Icon = activity.icon
                            return (
                                <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-[#E1EEFB] transition-colors">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <Icon className="w-6 h-6 text-[#1E4A7A]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-lg font-medium text-[#0A2A44]">{activity.action}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-base text-gray-600">Oleh: {activity.user}</span>
                                            <span className="text-base text-gray-400">•</span>
                                            <span className="text-base text-gray-400">{activity.time}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="mt-4 text-center">
                        <Button variant="link" className="text-[#1E4A7A] text-lg">
                            Lihat Semua Aktivitas →
                        </Button>
                    </div>
                </DataCard>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/admin/customers/add">
                    <Button className="w-full bg-white border-2 border-[#C2D9F0] hover:bg-[#E1EEFB] text-[#0A2A44] text-lg py-8 h-auto rounded-xl">
                        + Tambah Pelanggan
                    </Button>
                </Link>
                <Link href="/admin/admins/add">
                    <Button className="w-full bg-white border-2 border-[#C2D9F0] hover:bg-[#E1EEFB] text-[#0A2A44] text-lg py-8 h-auto rounded-xl">
                        + Tambah Admin
                    </Button>
                </Link>
                <Link href="/admin/services/add">
                    <Button className="w-full bg-white border-2 border-[#C2D9F0] hover:bg-[#E1EEFB] text-[#0A2A44] text-lg py-8 h-auto rounded-xl">
                        + Tambah Layanan
                    </Button>
                </Link>
                <Link href="/admin/bill">
                    <Button className="w-full bg-white border-2 border-[#C2D9F0] hover:bg-[#E1EEFB] text-[#0A2A44] text-lg py-8 h-auto rounded-xl">
                        📋 Buat Tagihan
                    </Button>
                </Link>
            </div>
        </div>
    )
}