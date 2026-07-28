export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-cinematic-bg">
      {/* Navbar Skeleton */}
      <nav className="sticky top-0 z-50 w-full border-b border-cinematic-border bg-cinematic-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-cinematic-card animate-pulse" />
            <div className="h-5 w-24 rounded bg-cinematic-card animate-pulse hidden sm:block" />
          </div>
          <div className="h-10 flex-1 max-w-md rounded-lg bg-cinematic-card animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-10 w-[120px] rounded-lg bg-cinematic-card animate-pulse" />
            <div className="h-10 w-20 rounded-lg bg-cinematic-card animate-pulse" />
          </div>
        </div>
      </nav>

      {/* Category Pills Skeleton */}
      <div className="w-full overflow-x-auto py-4">
        <div className="flex items-center gap-2 px-4 sm:px-6 max-w-7xl mx-auto min-w-max">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 w-20 rounded-full bg-cinematic-card animate-pulse" />
          ))}
        </div>
      </div>

      {/* Movie Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-[2/2.8] w-full rounded-xl bg-cinematic-card animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-cinematic-card animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-cinematic-card animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}