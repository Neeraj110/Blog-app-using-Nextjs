import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => (
  <div className="animate-pulse p-4 border-b border-gray-800">
    <div className="flex space-x-4">
      <Skeleton className="w-12 h-12 rounded-full bg-gray-800" />
      <div className="flex-1 space-y-4">
        <div className="flex space-x-2">
          <Skeleton className="h-4 w-24 bg-gray-800 rounded" />
          <Skeleton className="h-4 w-32 bg-gray-800 rounded" />
        </div>
        <Skeleton className="h-4 w-3/4 bg-gray-800 rounded" />
        <Skeleton className="h-4 w-1/2 bg-gray-800 rounded" />
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;
