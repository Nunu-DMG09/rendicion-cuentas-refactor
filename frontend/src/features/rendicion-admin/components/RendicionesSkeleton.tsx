
export default function RendicionesSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Banner skeleton */}
                    <div className="h-48 md:h-56 bg-gray-200" />
                    {/* Content skeleton */}
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-20 bg-gray-100 rounded-xl" />
                            <div className="h-20 bg-gray-100 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-100 rounded w-1/4" />
                            <div className="flex gap-2">
                                <div className="h-6 bg-gray-100 rounded-full w-24" />
                                <div className="h-6 bg-gray-100 rounded-full w-20" />
                                <div className="h-6 bg-gray-100 rounded-full w-28" />
                            </div>
                        </div>
                        <div className="h-12 bg-gray-200 rounded-xl" />
                    </div>
                </div>
            ))}
        </div>
    )
}