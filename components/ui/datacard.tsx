import { ReactNode } from "react"
import { cn } from "../../lib/utils"

interface DataCardProps {
    title: string
    subtitle?: string
    icon: ReactNode
    children: ReactNode
    actions?: ReactNode
    className?: string
}

export function DataCard({ title, subtitle, icon, children, actions, className }: DataCardProps) {
    return (
        <div className={cn(
            "bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200",
            className
        )}>
            <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#E6F0F9] rounded-lg text-[#0F5B8C]">
                            {icon}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{title}</h3>
                            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
                        </div>
                    </div>
                    {actions && <div className="flex items-center gap-2">{actions}</div>}
                </div>
            </div>
            <div className="p-5">
                {children}
            </div>
        </div>
    )
}