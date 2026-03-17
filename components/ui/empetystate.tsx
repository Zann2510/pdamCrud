import { ReactNode } from "react"
import { Inbox } from "lucide-react"
import { Button } from "../../components/ui/button"

interface EmptyStateProps {
    title: string
    description?: string
    icon?: ReactNode
    action?: {  // Perbaiki struktur action
        text: string  // Ubah dari 'label' ke 'text' agar lebih jelas
        onClick: () => void
    }
}

export function EmptyState({ 
    title, 
    description, 
    icon = <Inbox className="w-16 h-16" />,
    action 
}: EmptyStateProps) {
    return (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border-2 border-[#C2D9F0]">
            <div className="text-gray-300 mb-6 flex justify-center">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-[#0A2A44] mb-3">{title}</h3>
            {description && (
                <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">{description}</p>
            )}
            {action && (
                <Button 
                    onClick={action.onClick}
                    className="bg-[#1E4A7A] hover:bg-[#0A2A44] text-white text-lg px-8 py-6 h-auto rounded-xl"
                >
                    {action.text}  {/* Gunakan action.text */}
                </Button>
            )}
        </div>
    )
}