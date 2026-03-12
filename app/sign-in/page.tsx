"use client"

import { setCookie } from "cookies-next"
import { useState } from "react"
import { Droplets, Loader2 } from "lucide-react"

export default function SignInPage() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "APP-KEY": `${process.env.NEXT_PUBLIC_APP_KEY}`
                },
                body: JSON.stringify({ username, password })
            })
            const data = await res.json()

            if (!res.ok) {
                setError(data?.message || "Username atau password salah")
                return
            }

            setCookie("accessToken", data.token, { maxAge: 60 * 60 * 24 })
            setCookie("userRole", data.role, { maxAge: 60 * 60 * 24 })

            if (data.role === "ADMIN") window.location.href = "/admin/dashboard"
            else if (data.role === "CUSTOMER") window.location.href = "/costumer/dashboard"

        } catch {
            setError("Terjadi kesalahan jaringan. Coba lagi.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A3F62] via-[#0F5B8C] to-[#2B7CB0] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Droplets className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">PDAM</h1>
                    <p className="text-[#E6F0F9] text-sm mt-1">Perusahaan Daerah Air Minum</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Masuk ke Akun</h2>
                    <p className="text-gray-500 text-sm mb-6">Silakan masukkan kredensial Anda</p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                            <input
                                type="text" value={username} required
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Masukkan username"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0F5B8C] focus:ring-2 focus:ring-[#E6F0F9] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <input
                                type="password" value={password} required
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Masukkan password"
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#0F5B8C] focus:ring-2 focus:ring-[#E6F0F9] transition-all"
                            />
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-[#0F5B8C] hover:bg-[#2B7CB0] text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? "Memproses..." : "Masuk"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Belum punya akun?{" "}
                        <a href="/sign-up" className="text-[#0F5B8C] font-medium hover:underline">
                            Daftar di sini
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}