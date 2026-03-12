import { Services } from "../../types"
import { getCookies } from "../../../lib/server-cookies"
import AddService from "./add"
import DeleteService from "./delete"
import Search from "../../../components/Search"
import Pagination from "../../../components/Pagination"
import EditService from "./edit"

type ResultData = {
    success: boolean
    message: string
    data: Services[]
    count: number
}

async function getServices(page: number, quantity: number, search: string): Promise<ResultData> {
    try {
        const token = await getCookies("accessToken")
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/services?page=${page}&quantity=${quantity}&search=${search}`

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "APP-KEY": process.env.NEXT_PUBLIC_APP_KEY || "",
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        })

        const responseData: ResultData = await response.json()

        if (!response.ok) {
            console.log(responseData.message)
            return {
                success: responseData.success,
                message: responseData.message,
                data: [],
                count: 0
            }
        }

        return {
            success: responseData.success,
            message: responseData.message,
            data: responseData.data,
            count: responseData.count
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Failed to fetch services",
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

export default async function ServicesPage(prop: Props) {

    const page = (await prop.searchParams)?.page || 1
    const quantity = (await prop.searchParams)?.quantity || 1
    const search = (await prop.searchParams)?.search || ""
    const { count: counts, data: services } = await getServices(page, quantity, search)

    return (
        <div className="flex flex-col min-w-screen h-full p-5 bg-blue-50">
            <div className="bg-white p-5">
                <h1 className="font-bold text-blue-800 text-2xl mb-8">Service Data</h1>
                <div className="flex items-center w-full max-w-md grow">
                    <Search search={search ?? ``} />
                </div>
                {
                    services.length == 0 ? "Data service tidak ada" :
                        <div className="grid grid-cols-3 gap-3">
                            {services.map((service) => (
                                <div key={service.id} className="shadow-lg my-3 p-5 text-blue-500">
                                    <h2 className="mb-2 text-xl text-blue-800 font-semibold">{service.name}</h2>
                                    <p>Harga: Rp{service.price},-</p>
                                    <p>Layanan</p>
                                    <p>{service.min_usage} - {service.max_usage}</p>
                                    <div className="flex mt-4 gap-2">
                                        <EditService selectedData={service} />
                                        <DeleteService selectedData={service} />
                                    </div>
                                </div>
                            ))}
                        </div>
                }
                <div>
                    <AddService />
                </div>
                <Pagination count={counts} perPage={quantity} currentPage={page} />
            </div>
        </div>
    )
}