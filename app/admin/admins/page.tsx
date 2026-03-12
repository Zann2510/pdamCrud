import { Admin } from "../../types"
import Search from "../../../components/Search"
import { getCookies } from "../../../lib/server-cookies"
import Pagination from "../../../components/Pagination"
import DeleteCustomer from "./delete"
import EditCustomer from "./edit"
import ResetPasswordCustomer from "./resetPassword"
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
            console.log(ResponseData.message)
            return {
                success: ResponseData.success,
                message: ResponseData.message,
                data: [],
                count: 0
            }
        }

        return {
            success: ResponseData.success,
            message: ResponseData.message,
            data: ResponseData.data,
            count: ResponseData.count
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Failed to fetch customers",
            data: [],
            count: 0
        }
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
    const quantity = (await prop.searchParams)?.quantity || 1
    const search = (await prop.searchParams)?.search || ''
    const { count: counts, data: admins } = await getAdmins(page, quantity, search)

    return (
        <div className="flex flex-col min-w-screen h-full bg-blue-50 p-5">
            <div className="bg-white p-5">
                <h1 className="font-bold text-blue-800 text-2xl mb-8">Customers Data</h1>
                <div className="flex items-center w-full max-w-md grow">
                    <Search search={search ?? ''} />
                </div>
                {
                    admins.length == 0 ? "Data customer tidak ada" :
                        <div className="grid grid-cols-3 gap-3">
                            {admins.map((admin) => (
                                <div key={admin.id} className="shadow-lg my-3 p-5 text-blue-500">
                                    <h2 className="mb-2 text-xl text-blue-800 font-semibold">{admin.name}</h2>
                                    <p>username: {admin.user.username}</p>
                                    <p>Phone: {admin.phone}</p>
                                    <div className="flex mt-4 gap-2">
                                        <DeleteCustomer selectedData={admin}/>
                                        <EditCustomer selectedData={admin}/>
                                        <ResetPasswordCustomer selectedData={admin}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                }
                <div>
                    <AddAdmin/>
                </div>
                <Pagination count={counts} perPage={quantity} currentPage={page}/>
            </div>
        </div>
    )
}