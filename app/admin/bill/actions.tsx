"use client"

import { Bill } from "../../types"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import { MoreVertical } from "lucide-react"
import EditBill from "./edit"
import DeleteBill from "./delete"


export function BillActions({ bill }: { bill: Bill }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-[#E1EEFB]">
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 p-1">
                <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                    <div className="w-full"><EditBill selectedData={bill} /></div>
                </DropdownMenuItem>
                <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                    <div className="w-full"><DeleteBill selectedData={bill} /></div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}