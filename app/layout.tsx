import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ✅ FIX: Hapus import react-toastify — project ini pakai sonner, bukan react-toastify
// import 'react-toastify/dist/ReactToastify.css';  ← DIHAPUS

// ✅ FIX: Import Toaster dari sonner
// Toaster WAJIB dipasang di layout agar toast bisa muncul di semua halaman
// Tanpa ini, toast.success() / toast.error() dipanggil tapi tidak ada yang menampilkan
import { Toaster } from "../components/ui/sonner"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "PDAM App",
    description: "Perusahaan Daerah Air Minum",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {children}
                {/*
                    ✅ Toaster diletakkan di LUAR children tapi di dalam body
                    Ini memastikan toast bisa tampil di halaman manapun:
                    /sign-in, /admin/*, /costumer/* semuanya dapat Toaster ini
                    karena RootLayout membungkus semua halaman
                */}
                <Toaster richColors position="top-right" />
            </body>
        </html>
    );
}