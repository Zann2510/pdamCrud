import { Customer } from "../../types"
import { getCookies } from "../../../lib/server-cookies"

type ResultData = {
    success: boolean,
    message: string,
    data: Customer
}

async function getCustomerProfile(): Promise<Customer | null> {
    try {
        const token = await getCookies('accessToken')
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers/me`
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

export default async function DashboardCustomer() {
    const customerData = await getCustomerProfile()
    if (customerData == null) {
        return (
            <div className="w-full p-5">
                Sorry, customer data does not exist.
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full min-h-screen p-5 bg-blue-50 items-center">
            <div className="flex flex-col p-5 bg-white items-center w-[400px]">
                <h1 className="font-bold text-blue-800 text-xl">Customer Profile</h1>
                <table className="text-blue-500">
                    <tbody>
                        <tr>
                            <td className="p-2">Name</td>
                            <td className="p-2">: {customerData.name}</td>
                        </tr>
                        <tr>
                            <td className="p-2">Username</td>
                            <td className="p-2">: {customerData.user.username}</td>
                        </tr>
                        <tr>
                            <td className="p-2">NIK</td>
                            <td className="p-2">: {customerData.customer_number}</td>
                        </tr>
                        <tr>
                            <td className="p-2">Address</td>
                            <td className="p-2">: {customerData.address}</td>
                        </tr>
                        <tr>
                            <td className="p-2">Phone</td>
                            <td className="p-2">: {customerData.phone}</td>
                        </tr>
                        <tr>
                            <td className="p-2">Services</td>
                            <td className="p-2">: {customerData.service.name}</td>
                        </tr>
                        <tr>
                            <td className="p-2">Creation Date</td>
                            <td className="p-2">: {customerData.createdAt.substring(0, 10)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}