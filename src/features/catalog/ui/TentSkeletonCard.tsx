import { Skeleton } from '@/shared/ui/skeleton';

export const TentSkeletonCard = () => {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-1 flex-col p-5">
        <Skeleton className="mb-2 h-5 w-3/4" />
        <Skeleton className="mb-4 h-4 w-1/2" />
        <div className="mb-4 flex flex-wrap gap-1.5">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-6 h-4 w-2/3" />
        <div className="mt-auto flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-28 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
