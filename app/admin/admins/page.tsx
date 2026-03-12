import { Admin } from "../../types"
import Search from "../../../components/Search"
import { getCookies } from "../../../lib/server-cookies"
import Pagination from "../../../components/Pagination"
import DeleteAdmin from "./delete"
import EditAdmin from "./edit"
import ResetPasswordAdmin from "./resetPassword"
import AddAdmin from "./add"

type ResultData = {
    success: boolean
    message: string
    data: Admin[]
    count: number
}

async function getAdmins(page: number, quantity: number, search: string): Promise<ResultData> {
    try {
        const token = await getCookies("accessToken")
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins?page=${page}&quantity=${quantity}&search=${search}`

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        })

        const ResponseData: ResultData = await response.json()

        if (!response.ok) {
            return { success: false, message: ResponseData.message, data: [], count: 0 }
        }

        return ResponseData

    } catch (error) {
        console.log(error)
        return { success: false, message: "Failed to fetch admins", data: [], count: 0 }
    }
}

type Props = {
    searchParams: Promise<{
        page?: number
        quantity?: number
        search?: string
    }>
}

export default async function AdminsPage(prop: Props) {

    const page = (await prop.searchParams)?.page || 1
    const quantity = (await prop.searchParams)?.quantity || 10
    const search = (await prop.searchParams)?.search || ''
    const { count: counts, data: admins } = await getAdmins(page, quantity, search)

    return (
        <div className="flex flex-col min-w-screen h-full bg-blue-50 p-5">
            <div className="bg-white p-5">
                {/* ✅ FIX: Judul halaman diperbaiki dari "Customers Data" → "Admins Data" */}
                <h1 className="font-bold text-blue-800 text-2xl mb-8">Admins Data</h1>
                <div className="flex items-center justify-between mb-4">
                    <div className="w-full max-w-md">
                        <Search search={search ?? ''} />
                    </div>
                    {/* ✅ Tombol Add dipindah ke atas agar lebih mudah ditemukan */}
                    <AddAdmin />
                </div>
                {admins.length === 0
                    ? <p className="text-gray-500 py-4">Data admin tidak ada</p>
                    : <div className="grid grid-cols-3 gap-3">
                        {admins.map((admin) => (
                            <div key={admin.id} className="shadow-lg my-3 p-5 text-blue-500">
                                <h2 className="mb-2 text-xl text-blue-800 font-semibold">{admin.name}</h2>
                                <p>Username: {admin.user.username}</p>
                                <p>Phone: {admin.phone}</p>
                                <div className="flex mt-4 gap-2 flex-wrap">
                                    <DeleteAdmin selectedData={admin} />
                                    <EditAdmin selectedData={admin} />
                                    <ResetPasswordAdmin selectedData={admin} />
                                </div>
                            </div>
                        ))}
                    </div>
                }
                <Pagination count={counts} perPage={quantity} currentPage={page} />
            </div>
        </div>
    )
}