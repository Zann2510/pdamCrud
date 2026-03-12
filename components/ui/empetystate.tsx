import { ReactNode } from "react"
import { Inbox } from "lucide-react"

interface EmptyStateProps {
    title?: string
    description?: string
    icon?: ReactNode
    action?: ReactNode
}

export function EmptyState({
    title = "Tidak ada data",
    description = "Belum ada data yang tersedia saat ini.",
    icon = <Inbox className="w-12 h-12" />,
    action,
}: EmptyStateProps) {
    return (
        <div className="text-center py-16 px-4 bg-white rounded-xl border border-gray-200">
            <div className="text-gray-300 mb-4 flex justify-center">
                {icon}
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">{description}</p>
            {action && action}
        </div>
    )
}