import { ReactNode } from "react"

interface PageHeaderProps {
    title: string
    description?: string
    actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
    return (
        <div className="mb-7 flex items-center justify-between animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {description && <p className="text-gray-500 mt-1 text-sm">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
    )
}