"use client"

import { useState } from "react"
import { Admin } from "../../types"
import { getCookie } from "cookies-next/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Pencil, X, Save, Loader2 } from "lucide-react"

export default function AdminProfileForm({ admin }: { admin: Admin }) {
    const router = useRouter()
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState({ name: admin.name, phone: admin.phone, password: "" })

    const handleCancel = () => {
        setProfile({ name: admin.name, phone: admin.phone, password: "" })
        setIsEdit(false)
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const token = await getCookie("accessToken")
            const payload: Record<string, string> = { name: profile.name, phone: profile.phone }
            if (profile.password.trim()) payload.password = profile.password

            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/${admin.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })
            const result = await res.json()
            if (result?.success) {
                toast.success(result.message)
                setIsEdit(false)
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast.warning(result.message)
            }
        } catch {
            toast.error("Terjadi kesalahan. Coba lagi.")
        } finally {
            setLoading(false)
        }
    }

    const inputClass = (editable: boolean) =>
        `w-full border rounded-lg px-3 py-2 text-sm transition-all outline-none ${
            editable
                ? "bg-white border-[#0F5B8C]/30 focus:border-[#0F5B8C] focus:ring-2 focus:ring-[#E6F0F9] text-gray-800"
                : "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
        }`

    return (
        <div className="p-6 animate-fade-in">
            <div className="max-w-2xl mx-auto">
                {/* Page Title */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Profile Saya</h1>
                    <p className="text-gray-500 text-sm mt-1">Kelola informasi akun administrator</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Avatar Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#0F5B8C] to-[#2B7CB0] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
                            {admin.name?.charAt(0) ?? "A"}
                        </div>
                        <p className="font-semibold text-gray-900">{admin.name}</p>
                        <p className="text-sm text-gray-500 mt-0.5">@{admin.user.username}</p>
                        <span className="mt-2 inline-block text-xs bg-[#E6F0F9] text-[#0F5B8C] px-2 py-0.5 rounded-full font-medium">
                            Administrator
                        </span>
                        <p className="mt-4 text-xs text-gray-400">
                            Bergabung: {new Date(admin.createdAt).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-semibold text-gray-900">Edit Informasi</h2>
                            {!isEdit ? (
                                <button
                                    onClick={() => setIsEdit(true)}
                                    className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-[#0F5B8C] text-white hover:bg-[#2B7CB0] transition-colors"
                                >
                                    <Pencil className="w-3.5 h-3.5" /> Edit
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCancel}
                                        disabled={loading}
                                        className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        <X className="w-3.5 h-3.5" /> Batal
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                        {loading ? "Menyimpan..." : "Simpan"}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                                <input type="text" value={admin.user.username} disabled className={inputClass(false)} />
                                <p className="text-xs text-gray-400 mt-1">Username tidak dapat diubah</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                                <input
                                    type="text" value={profile.name}
                                    disabled={!isEdit}
                                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                                    className={inputClass(isEdit)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">No. Telepon</label>
                                <input
                                    type="text" value={profile.phone}
                                    disabled={!isEdit}
                                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                    className={inputClass(isEdit)}
                                />
                            </div>
                            {isEdit && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Password Baru <span className="text-gray-400 font-normal">(opsional)</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={profile.password}
                                        placeholder="Kosongkan jika tidak ingin mengubah"
                                        onChange={e => setProfile({ ...profile, password: e.target.value })}
                                        className={inputClass(true)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}