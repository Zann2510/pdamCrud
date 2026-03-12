"use client"

import { setCookie } from "cookies-next"
import { useState } from "react"

export default function SignInPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(false);

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault()

        // ✅ FIX 1: setLoading(true) dipanggil di awal, SEBELUM try block
        // Sebelumnya tidak ada baris ini sama sekali
        setLoading(true)
        setError("")

        try {
            const request = JSON.stringify({ username, password })

            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth`
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "APP-KEY": `${process.env.NEXT_PUBLIC_APP_KEY}`
                },
                body: request
            })

            const responseData = await response.json()

            if (!response.ok) {
                setError(responseData?.message || "Gagal melakukan login")
                return;
            }

            setCookie('accessToken', responseData.token, { maxAge: 60 * 60 * 24 })
            setCookie('userRole', responseData.role, { maxAge: 60 * 60 * 24 })

            // ✅ FIX 2: Pakai absolute path, bukan relative path "../admin/dashboard"
            // Relative path bisa rusak jika URL berubah, absolute path selalu aman
            if (responseData.role === "ADMIN") {
                window.location.href = "/admin/dashboard"
            } else if (responseData.role === "CUSTOMER") {
                window.location.href = "/costumer/dashboard"
            }

        } catch (error) {
            console.error("Error during sign in:", error)
            setError("Terjadi kesalahan jaringan. Coba lagi.")
        } finally {
            // finally selalu jalan — pastikan loading mati setelah proses selesai
            setLoading(false)
        }
    }

    return (
        <div className="w-full h-dvh bg-blue-50 p-3 flex items-center justify-center">
            <div className="bg-white p-10 w-full md:w-1/2 lg:w-1/3 rounded-lg shadow-lg">
                <h1 className="text-center font-bold text-blue-800 text-2xl mb-6">
                    Login PDAM
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSignIn}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-semibold text-blue-500 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border border-blue-300 text-slate-900 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-blue-500 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-blue-300 text-slate-900 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white p-2 font-semibold hover:bg-blue-600 rounded disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? "Loading..." : "Sign In"}
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Belum punya akun?{" "}
                        <a href="/sign-up" className="text-blue-500 hover:underline">
                            Daftar di sini
                        </a>
                    </p>
                </form>
            </div>
        </div>
    )
}