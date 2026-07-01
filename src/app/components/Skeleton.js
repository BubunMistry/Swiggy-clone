'use client'

export function SkeletonBlock({ className = '' }) {
  return <div className={`animate-pulse rounded bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 ${className}`} />
}

export function RestaurantGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-100 p-3 space-y-3">
          <SkeletonBlock className="h-40 w-full" />
          <SkeletonBlock className="h-5 w-3/4" />
          <SkeletonBlock className="h-4 w-1/2" />
          <SkeletonBlock className="h-4 w-full" />
        </div>
      ))}
    </div>
  )
}

export function ListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-100 p-4 flex gap-4">
          <SkeletonBlock className="h-16 w-16 flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <SkeletonBlock className="h-5 w-2/3" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
