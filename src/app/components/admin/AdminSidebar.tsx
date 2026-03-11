"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BillingIcon, DashboardIcon, ReportsIcon, SettingsIcon, UsersIcon, WaterDropIcon } from "../shared/Icons";


// Type untuk menu item
interface MenuItem {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  href: string;
  badge?: number;
}

export default function AdminSidebar() {
  const pathname = usePathname()
  
  // Daftar menu
  const menuItems: MenuItem[] = [
    {
      icon: DashboardIcon,
      label: "Dashboard",
      href: "/admin/dasboard",
    },
    {
      icon: UsersIcon,
      label: "Data Pelanggan",
      href: "/admin/customers",
      badge: 5,
    },
    {
      icon: BillingIcon,
      label: "Tagihan",
      href: "/admin/billing",
    },
    {
      icon: ReportsIcon,
      label: "Laporan",
      href: "/admin/reports",
    },
    {
      icon: SettingsIcon,
      label: "Pengaturan",
      href: "/admin/settings",
    },
  ]
  
  return (
    <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white min-h-screen flex flex-col shadow-xl">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <WaterDropIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">PDAM Admin</h2>
            <p className="text-xs text-blue-300">Management System</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center justify-between
                gap-3 px-4 py-3
                rounded-lg
                transition-all
                duration-200
                group
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <item.icon 
                  size={20}
                  className={`
                    transition-transform
                    group-hover:scale-110
                    ${isActive ? 'scale-110' : ''}
                  `}
                />
                <span className="font-medium">{item.label}</span>
              </div>
              
              {item.badge && item.badge > 0 && (
                <span className="
                  px-2 py-1
                  text-xs
                  bg-red-500
                  text-white
                  rounded-full
                  font-semibold
                  min-w-[24px]
                  text-center
                ">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
      
      {/* Footer Info */}
      <div className="p-4 border-t border-blue-700">
        <div className="px-4 py-3 bg-blue-700 rounded-lg">
          <p className="text-xs text-blue-200">Version 1.0.0</p>
          <p className="text-xs text-blue-300 mt-1">© 2025 PDAM System</p>
        </div>
      </div>
    </aside>
  )
}