import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../../components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { Items } from "../../app/admin/admin_menu"

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Image
                            className="max-w-[50] h-[50] justify-self-center"
                            src="/images/logo.png"
                            alt="Logo"
                            width={100}
                            height={100}
                            priority
                            />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xl tracking-wide font-semibold mb-5">Administrator</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {Items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild className="my-1 tracking-wide">
                                        <Link href={item.url}>
                                        <item.icon/>
                                        <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}