"use client"

// ✅ Hapus import { use } yang tidak terpakai
import { useState } from "react"
import { Admin } from "../../types"
import { getCookie } from "cookies-next/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type Props = {
    admin: Admin
}

export default function AdminProfileForm({ admin }: Props) {
    const router = useRouter()
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState({
        name: admin.name,
        phone: admin.phone,
        password: "",
    })

    const handleCancel = () => {
        // Reset ke data awal saat cancel
        setProfile({ name: admin.name, phone: admin.phone, password: "" })
        setIsEdit(false)
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const token = await getCookie("accessToken")
            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/${admin.id}`

            // Hanya kirim password jika diisi
            const payload: Record<string, string> = {
                name: profile.name,
                phone: profile.phone,
            }
            if (profile.password.trim()) {
                payload.password = profile.password
            }

            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            const result = await response.json()
            if (result?.success) {
                toast.success(result.message)
                setIsEdit(false)
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast.warning(result.message)
            }
        } catch (error) {
            toast.error("Terjadi kesalahan. Coba lagi.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full h-full bg-gray-100 p-6">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-gray-800">Admin Profile</h1>
                    {!isEdit ? (
                        <button
                            onClick={() => setIsEdit(true)}
                            className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="text-sm px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="text-sm px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Menyimpan..." : "Save"}
                            </button>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {/* Username — read only, tidak bisa diedit */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Username</label>
                        <input
                            type="text"
                            value={admin.user.username}
                            disabled
                            className="w-full border rounded-lg p-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">Username tidak bisa diubah</p>
                    </div>

                    {/* Name — bisa diedit */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-medium">Nama</label>
                        <input
                            type="text"
                            value={profile.name}
                            // ✅ FIX: disabled hanya saat bukan mode edit
                            // Sebelumnya selalu disabled sehingga tidak pernah bisa diedit
                            disabled={!isEdit}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className={`w-full border rounded-lg p-2 transition-colors ${
                                isEdit
                                    ? "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    : "bg-gray-100 text-gray-500 cursor-not-allowed"
                            }`}
                        />
                    </div>

                    {/* Phone — bisa diedit */}
                    <div>
                        <label className="block text-sm text-gray-600 mb-1 font-medium">No. Telepon</label>
                        <input
                            type="text"
                            value={profile.phone}
                            disabled={!isEdit}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className={`w-full border rounded-lg p-2 transition-colors ${
                                isEdit
                                    ? "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    : "bg-gray-100 text-gray-500 cursor-not-allowed"
                            }`}
                        />
                    </div>

                    {/* Password — hanya muncul saat mode edit, opsional */}
                    {isEdit && (
                        <div>
                            <label className="block text-sm text-gray-600 mb-1 font-medium">
                                Password Baru <span className="text-gray-400 font-normal">(kosongkan jika tidak ingin mengubah)</span>
                            </label>
                            <input
                                type="password"
                                value={profile.password}
                                onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                                placeholder="Password baru..."
                                className="w-full border rounded-lg p-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}