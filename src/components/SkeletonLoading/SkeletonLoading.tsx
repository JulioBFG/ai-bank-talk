import { Skeleton } from "@/components/ui/skeleton"

const SkeletonLoading = () => {
  return (
    <div className="space-y-2 my-2">
      <Skeleton className="h-4 w-[350px] bg-gray-300" />
      <Skeleton className="h-4 w-[250px] bg-gray-300" />
      <Skeleton className="h-4 w-[200px] bg-gray-300" />
    </div>
  )
}
export default SkeletonLoading