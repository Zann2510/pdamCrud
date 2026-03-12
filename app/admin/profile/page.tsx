import { Admin } from "../../types"
import { getCookies } from "../../../lib/server-cookies"
import AdminProfileForm from "./form"

type ResultData = {
    success: boolean
    message: string
    data: Admin
}

async function getAdminProfile(): Promise<Admin | null> {
    try {
        const token = await getCookies("accessToken")
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/me`
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                "Authorization": `Bearer ${token}`
            },
            // cache: "no-store" agar data selalu fresh setelah edit
            cache: "no-store"
        })

        const responseData: ResultData = await response.json()

        if (!response.ok) {
            console.log(responseData?.message)
            return null
        }

        return responseData.data

    } catch (error) {
        console.log(error)
        return null
    }
}

export default async function ProfilePage() {
    const adminData = await getAdminProfile()

    if (!adminData) {
        return (
            <div className="w-full p-5 text-gray-500">
                Data admin tidak ditemukan.
            </div>
        )
    }

    // ✅ FIX: Gunakan AdminProfileForm yang sudah diperbaiki
    // Sebelumnya page.tsx menampilkan tabel statis saja, tidak pakai form.tsx sama sekali
    return <AdminProfileForm admin={adminData} />
}