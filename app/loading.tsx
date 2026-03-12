import { SkeletonCard } from "../components/ui/skeletoncard";


export default function AdminLoading() {
    return (
        <div className="p-6 space-y-6 animate-pulse">
            <div className="h-7 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-64 bg-gray-100 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
        </div>
    )
}