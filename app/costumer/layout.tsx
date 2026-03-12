import Header from "../../components/admin-template/header"

export default function CostumerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        // ✅ Cukup return div biasa, tidak perlu <html> atau <body>
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}