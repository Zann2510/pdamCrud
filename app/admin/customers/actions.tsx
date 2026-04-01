"use client"

import { Customer, Services } from "../../types"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import { MoreVertical } from "lucide-react"
import EditCustomer from "./edit"
import DeleteCustomer from "./delete"
import ResetPasswordCustomer from "./resetPassword"

type Props = {
    customer: Customer
    services: Services[]
}

export function CustomerActions({ customer, services }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-[#E1EEFB]">
                    <MoreVertical className="h-5 w-5 text-gray-500" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1">
                <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                    <div className="w-full"><EditCustomer selectedData={customer} serviceData={services} /></div>
                </DropdownMenuItem>
                <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                    <div className="w-full"><ResetPasswordCustomer selectedData={customer} /></div>
                </DropdownMenuItem>
                <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                    <div className="w-full"><DeleteCustomer selectedData={customer} /></div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}