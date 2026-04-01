"use client"

import { Admin } from "../../types"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Button } from "../../../components/ui/button"
import { MoreVertical } from "lucide-react"
import EditAdmin from "./edit"
import DeleteAdmin from "./delete"
import ResetPasswordAdmin from "./resetPassword"

export function AdminActions({ admin }: { admin: Admin }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-[#E1EEFB]">
                    <MoreVertical className="h-5 w-5 text-gray-500" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1">
                <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                    <div className="w-full"><EditAdmin selectedData={admin} /></div>
                </DropdownMenuItem>
                <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                    <div className="w-full"><ResetPasswordAdmin selectedData={admin} /></div>
                </DropdownMenuItem>
                <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                    <div className="w-full"><DeleteAdmin selectedData={admin} /></div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}