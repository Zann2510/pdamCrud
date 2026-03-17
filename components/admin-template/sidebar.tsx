"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "../../components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../../lib/utils"
import { Items } from "../../app/admin/admin_menu"
import { Droplets } from "lucide-react"
import LogoutButton from "../ui/logoutbutton"


export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2.5 px-2 py-3">
                    <div className="w-8 h-8 bg-[#0F5B8C] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Droplets className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-sm text-gray-900 leading-none">PDAM</p>
                        <p className="text-xs text-[#0F5B8C] mt-0.5">Administrator</p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                        Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {Items.map((item) => {
                                const isActive = pathname === item.url
                                const isDisabled = item.url === "#"

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            className={cn(
                                                "my-0.5 rounded-lg transition-all duration-150",
                                                isActive
                                                    ? "bg-[#0F5B8C] text-white hover:bg-[#0F5B8C] hover:text-white"
                                                    : "text-gray-600 hover:bg-[#E6F0F9] hover:text-[#0F5B8C]",
                                                isDisabled && "opacity-40 pointer-events-none"
                                            )}
                                        >
                                            <Link
                                                href={isDisabled ? "#" : item.url}
                                                aria-disabled={isDisabled}
                                                tabIndex={isDisabled ? -1 : undefined}
                                            >
                                                <item.icon className={cn(
                                                    "w-4 h-4 flex-shrink-0",
                                                    isActive ? "text-white" : "text-gray-400"
                                                )} />
                                                <span>{item.title}</span>
                                                {isDisabled && (
                                                    <span className="ml-auto text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">
                                                        Soon
                                                    </span>
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* ✅ LogoutButton dipasang di sini */}
            <SidebarFooter>
                <LogoutButton />
            </SidebarFooter>
        </Sidebar>
    )
}