export function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-gray-200 rounded-lg" />
                <div className="space-y-2 flex-1">
                    <div className="h-4 w-2/3 bg-gray-200 rounded" />
                    <div className="h-3 w-1/2 bg-gray-200 rounded" />
                </div>
            </div>
            <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-4/5" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
        </div>
    )
}

export function SkeletonTable() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse space-y-4">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex gap-4">
                    <div className="h-4 w-1/4 bg-gray-200 rounded" />
                    <div className="h-4 w-1/4 bg-gray-200 rounded" />
                    <div className="h-4 w-1/4 bg-gray-200 rounded" />
                    <div className="h-4 w-1/4 bg-gray-200 rounded" />
                </div>
            ))}
        </div>
    )
}