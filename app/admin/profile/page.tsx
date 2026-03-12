import { Admin } from "../../types"
import { getCookies } from "../../../lib/server-cookies"

type ResultData = {
    success: boolean,
    message: string,
    data: Admin
}

async function getAdminProfile(): Promise<Admin | null> {
    try {
        const token = await getCookies('accessToken')
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins/me`
        const response = await fetch(url,
            {
                method: "GET",
                headers: {
                    "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                    "Authorization": `Bearer ${token}`
                }
            }
        )

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

export default async function DashboardAdmin() {
    const adminData = await getAdminProfile()
    if (adminData == null) {
        return (
            <div className="w-full p-5">
                Sorry, admin data does not exist.
            </div>
        )
    }
    return (
        <div className="flex flex-col w-full min-w-screen h-full p-5 bg-blue-50">
            <div className="flex flex-col p-5 bg-white w-[400px]">
                <h1 className="font-bold text-blue-800 text-xl">Admin Profile</h1>
                <table className="text-blue-500">
                    <tbody>
                        <tr>
                            <td className="p-2">Name</td>
                            <td className="p-2">: {adminData.name}</td>
                        </tr>
                        <tr>
                            <td className="p-2">Username</td>
                            <td className="p-2">: {adminData.user.username}</td>
                        </tr>
                        <tr>
                            <td className="p-2">Phone</td>
                            <td className="p-2">: {adminData.phone}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}