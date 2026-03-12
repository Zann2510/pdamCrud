import { Customer, Services } from "../../types"
import Search from "../../../components/Search"
import { getCookies } from "../../../lib/server-cookies"
import AddCustomer from "./add"
import Pagination from "../../../components/Pagination"
import DeleteCustomer from "./delete"
import EditCustomer from "./edit"
import ResetPasswordCustomer from "./resetPassword"

type ResultData = {
    success: boolean
    message: string
    data: Customer[]
    count: number
}

type ServiceData = {
    success: boolean
    message: string
    data: Services[]
    count: number
}

async function getCustomersAdmin(page: number, quantity: number, search: string): Promise<ResultData> {
    try {
        const token = await getCookies("accessToken")
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/customers?page=${page}&quantity=${quantity}&search=${search}`

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

async function GetServices(): Promise<Services[]> {
    try {
        const token = await getCookies("accessToken")
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/services`

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || '',
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        })

        const serviceData: ServiceData = await response.json()

        if (!response.ok) {
            return []
        }

        return serviceData.data

    } catch (error) {
        console.log(error)
        return []
    }
}

export default async function AdminCustomersPage(prop: Props) {

    const page = (await prop.searchParams)?.page || 1
    const quantity = (await prop.searchParams)?.quantity || 1
    const search = (await prop.searchParams)?.search || ''
    const { count: counts, data: customers } = await getCustomersAdmin(page, quantity, search)
    const service = await GetServices()

    return (
        <div className="flex flex-col min-w-screen h-full bg-blue-50 p-5">
            <div className="bg-white p-5">
                <h1 className="font-bold text-blue-800 text-2xl mb-8">Customers Data</h1>
                <div className="flex items-center w-full max-w-md grow">
                    <Search search={search ?? ''} />
                </div>
                {
                    customers.length == 0 ? "Data customer tidak ada" :
                        <div className="grid grid-cols-3 gap-3">
                            {customers.map((customer) => (
                                <div key={customer.id} className="shadow-lg my-3 p-5 text-blue-500">
                                    <h2 className="mb-2 text-xl text-blue-800 font-semibold">{customer.name}</h2>
                                    <p>NIK: {customer.customer_number}</p>
                                    <p>Address: {customer.address}</p>
                                    <p>Phone: {customer.phone}</p>
                                    <p>Services: {customer.service.name}</p>
                                    <div className="flex mt-4 gap-2">
                                        <DeleteCustomer selectedData={customer}/>
                                        <EditCustomer selectedData={customer} serviceData={service}/>
                                        <ResetPasswordCustomer selectedData={customer}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                }
                <div>
                    <AddCustomer serviceData={service} />
                </div>
                <Pagination count={counts} perPage={quantity} currentPage={page}/>
            </div>
        </div>
    )
}