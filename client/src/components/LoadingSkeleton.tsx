interface LoadingSkeletonProps {
  count?: number;
  type?: "card" | "list" | "table";
}

/**
 * Reusable loading skeleton component for different content types
 */
export const LoadingSkeleton = ({
  count = 6,
  type = "card",
}: LoadingSkeletonProps) => {
  if (type === "card") {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </>
    );
  }

  if (type === "list") {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="p-4 bg-gray-50 rounded-lg animate-pulse flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (type === "table") {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <tr key={i} className="animate-pulse">
            <td className="px-4 py-3">
              <div className="h-4 bg-gray-200 rounded"></div>
            </td>
            <td className="px-4 py-3">
              <div className="h-4 bg-gray-200 rounded"></div>
            </td>
            <td className="px-4 py-3">
              <div className="h-4 bg-gray-200 rounded"></div>
            </td>
          </tr>
        ))}
      </>
    );
  }

  return null;
};

export default LoadingSkeleton;
