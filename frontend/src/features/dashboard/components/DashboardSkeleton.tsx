

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-300 rounded-2xl h-32"></div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-300 rounded-2xl h-80"></div>
        <div className="bg-gray-300 rounded-2xl h-80"></div>
      </div>

      {/* Bottom Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-300 rounded-2xl h-96"></div>
        <div className="bg-gray-300 rounded-2xl h-96"></div>
      </div>
    </div>
  )
}