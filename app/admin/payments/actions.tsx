"use client"

import { Payment } from "../../types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import { MoreVertical } from "lucide-react"
import VerifyPayment from "./verify"

export function PaymentActions({ payment }: { payment: Payment }) {
    if (payment.status !== "PENDING") return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-[#E1EEFB]">
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 p-1">
                <DropdownMenuItem asChild onSelect={e => e.preventDefault()}>
                    {/* ✅ Hanya satu action: Verifikasi */}
                    <div className="w-full"><VerifyPayment payment={payment} /></div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}