import { ReactNode } from "react"
import { cn } from "../../lib/utils"

interface StatCardProps {
    title: string
    value: string | number
    icon: ReactNode
    trend?: string
    color?: "blue" | "green" | "orange" | "red"
    href?: string
}

const colorVariants = {
    blue: "bg-[#E6F0F9] text-[#0F5B8C] border-[#E6F0F9]",
    green: "bg-green-50 text-emerald-600 border-green-100",
    orange: "bg-orange-50 text-amber-600 border-orange-100",
    red: "bg-red-50 text-red-500 border-red-100",
}

export function StatCard({ title, value, icon, trend, color = "blue", href }: StatCardProps) {
    const isPositive = trend?.startsWith("+")

    const content = (
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                    {trend && (
                        <p className={cn(
                            "text-sm mt-2 flex items-center gap-1",
                            isPositive ? "text-emerald-600" : "text-red-500"
                        )}>
                            {isPositive ? "↑" : "↓"} {trend}
                        </p>
                    )}
                </div>
                <div className={cn("p-3 rounded-xl border", colorVariants[color])}>
                    {icon}
                </div>
            </div>
        </div>
    )

    if (href) {
        return <a href={href}>{content}</a>
    }
    return content
}