"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Droplet, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@base-ui/react"


export default function SignUpPage() {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [phone, setPhone] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errors, setErrors] = useState<{
        username?: string;
        password?: string;
        name?: string;
        phone?: string;
        general?: string;
    }>({})

    // Validasi form
    const validateForm = () => {
        const newErrors: typeof errors = {}
        
        if (!username.trim()) {
            newErrors.username = "Username harus diisi"
        } else if (username.length < 3) {
            newErrors.username = "Username minimal 3 karakter"
        }
        
        if (!password) {
            newErrors.password = "Password harus diisi"
        } else if (password.length < 6) {
            newErrors.password = "Password minimal 6 karakter"
        }
        
        if (!name.trim()) {
            newErrors.name = "Nama harus diisi"
        }
        
        if (!phone.trim()) {
            newErrors.phone = "Nomor telepon harus diisi"
        } else if (!/^[0-9]{10,13}$/.test(phone.replace(/\D/g, ''))) {
            newErrors.phone = "Nomor telepon tidak valid (10-13 angka)"
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    async function handleSignUp(e: React.FormEvent) {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }
        
        setIsLoading(true)
        setErrors({})
        
        try {
            const request = JSON.stringify({
                username: username.trim(),
                password: password,
                name: name.trim(),
                phone: phone.trim()
            })
            
            const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins`
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "app-key": `${process.env.NEXT_PUBLIC_APP_KEY}`
                },
                body: request,
            })
            
            const responseData = await response.json()
            
            if (!response.ok) {
                setErrors({
                    general: responseData.message || "Gagal melakukan registrasi"
                })
                return
            }
            
            // Tampilkan pesan sukses
            alert("Registrasi berhasil! Silakan login dengan akun Anda.")
            
            // Redirect ke halaman login
            window.location.href = "/sign-in"
            
        } catch (error) {
            console.error("Error during sign up:", error)
            setErrors({
                general: "Terjadi kesalahan jaringan. Silakan coba lagi."
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Format nomor telepon saat mengetik
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '') // Hanya angka
        setPhone(value)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E1EEFB] to-[#F0F7FF] flex items-center justify-center p-4 sm:p-6">
            {/* Background Pattern (optional) */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#1E4A7A] rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#1E4A7A] rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-2xl">
                {/* Back to Home Link */}
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 text-[#1E4A7A] hover:text-[#0A2A44] mb-6 text-lg font-medium transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Kembali ke Beranda
                </Link>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl border-2 border-[#C2D9F0] overflow-hidden">
                    {/* Header dengan gradien */}
                    <div className="bg-gradient-to-r from-[#1E4A7A] to-[#0A2A44] p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <Droplet className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Daftar Admin PDAM
                        </h1>
                        <p className="text-[#E1EEFB] text-lg">
                            Buat akun baru untuk mengelola sistem PDAM
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="p-8 md:p-10">
                        {/* Error Message */}
                        {errors.general && (
                            <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
                                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                                <span className="text-lg">{errors.general}</span>
                            </div>
                        )}

                        <form onSubmit={handleSignUp} className="space-y-6">
                            {/* Username Field */}
                            <div className="space-y-2">
                                <label htmlFor="username" className="text-lg font-semibold text-[#0A2A44]">
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Masukkan username"
                                    className={`
                                        w-full p-4 text-lg border-2 rounded-xl bg-white
                                        focus:outline-none focus:ring-4 focus:ring-[#1E4A7A]/20
                                        transition-all
                                        ${errors.username 
                                            ? 'border-red-300 focus:border-red-500' 
                                            : 'border-[#C2D9F0] focus:border-[#1E4A7A]'
                                        }
                                    `}
                                    disabled={isLoading}
                                />
                                {errors.username && (
                                    <p className="text-red-600 text-base mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.username}
                                    </p>
                                )}
                                <p className="text-gray-500 text-base">
                                    Minimal 3 karakter, gunakan kombinasi huruf dan angka
                                </p>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-lg font-semibold text-[#0A2A44]">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Masukkan password"
                                        className={`
                                            w-full p-4 text-lg border-2 rounded-xl bg-white pr-14
                                            focus:outline-none focus:ring-4 focus:ring-[#1E4A7A]/20
                                            transition-all
                                            ${errors.password 
                                                ? 'border-red-300 focus:border-red-500' 
                                                : 'border-[#C2D9F0] focus:border-[#1E4A7A]'
                                            }
                                        `}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1E4A7A] transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-6 h-6" />
                                        ) : (
                                            <Eye className="w-6 h-6" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-600 text-base mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.password}
                                    </p>
                                )}
                                <p className="text-gray-500 text-base">
                                    Minimal 6 karakter, gunakan kombinasi huruf dan angka untuk keamanan
                                </p>
                            </div>

                            {/* Name Field */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-lg font-semibold text-[#0A2A44]">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Masukkan nama lengkap"
                                    className={`
                                        w-full p-4 text-lg border-2 rounded-xl bg-white
                                        focus:outline-none focus:ring-4 focus:ring-[#1E4A7A]/20
                                        transition-all
                                        ${errors.name 
                                            ? 'border-red-300 focus:border-red-500' 
                                            : 'border-[#C2D9F0] focus:border-[#1E4A7A]'
                                        }
                                    `}
                                    disabled={isLoading}
                                />
                                {errors.name && (
                                    <p className="text-red-600 text-base mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Phone Field */}
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-lg font-semibold text-[#0A2A44]">
                                    Nomor Telepon <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                                        +62
                                    </span>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        placeholder="81234567890"
                                        className={`
                                            w-full p-4 text-lg border-2 rounded-xl bg-white pl-16
                                            focus:outline-none focus:ring-4 focus:ring-[#1E4A7A]/20
                                            transition-all
                                            ${errors.phone 
                                                ? 'border-red-300 focus:border-red-500' 
                                                : 'border-[#C2D9F0] focus:border-[#1E4A7A]'
                                            }
                                        `}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="text-red-600 text-base mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.phone}
                                    </p>
                                )}
                                <p className="text-gray-500 text-base">
                                    Contoh: 81234567890 (tanpa angka 0 di depan)
                                </p>
                            </div>

                            {/* Password Requirements Checklist */}
                            <div className="bg-[#F8FBFF] rounded-xl border-2 border-[#C2D9F0] p-5">
                                <p className="text-base font-semibold text-[#0A2A44] mb-3">
                                    Kriteria Password:
                                </p>
                                <ul className="space-y-2 text-base">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className={`w-5 h-5 ${password.length >= 6 ? 'text-green-500' : 'text-gray-300'}`} />
                                        <span className={password.length >= 6 ? 'text-gray-700' : 'text-gray-400'}>
                                            Minimal 6 karakter
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className={`w-5 h-5 ${/[A-Z]/.test(password) ? 'text-green-500' : 'text-gray-300'}`} />
                                        <span className={/[A-Z]/.test(password) ? 'text-gray-700' : 'text-gray-400'}>
                                            Mengandung huruf besar (A-Z)
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle className={`w-5 h-5 ${/[0-9]/.test(password) ? 'text-green-500' : 'text-gray-300'}`} />
                                        <span className={/[0-9]/.test(password) ? 'text-gray-700' : 'text-gray-400'}>
                                            Mengandung angka (0-9)
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="w-5 h-5 mt-1 border-2 border-[#C2D9F0] rounded text-[#1E4A7A] focus:ring-[#1E4A7A]"
                                    required
                                />
                                <label htmlFor="terms" className="text-lg text-gray-600">
                                    Saya menyetujui{' '}
                                    <a href="#" className="text-[#1E4A7A] hover:underline font-medium">
                                        Syarat & Ketentuan
                                    </a>{' '}
                                    dan{' '}
                                    <a href="#" className="text-[#1E4A7A] hover:underline font-medium">
                                        Kebijakan Privasi
                                    </a>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#1E4A7A] hover:bg-[#0A2A44] text-white text-xl py-8 h-auto rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Memproses...</span>
                                    </div>
                                ) : (
                                    "Daftar Sekarang"
                                )}
                            </Button>

                            {/* Login Link */}
                            <p className="text-center text-lg text-gray-600 mt-6">
                                Sudah punya akun?{' '}
                                <Link 
                                    href="/sign-in" 
                                    className="text-[#1E4A7A] hover:text-[#0A2A44] font-semibold hover:underline"
                                >
                                    Masuk di sini
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-gray-500 text-base mt-6">
                    Dengan mendaftar, Anda akan mendapatkan akses sebagai Admin PDAM
                </p>
            </div>
        </div>
    )
}