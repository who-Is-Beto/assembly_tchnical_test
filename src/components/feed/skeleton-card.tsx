const SkeletonCard = () => (
  <div
    aria-hidden="true"
    className="mb-6 break-inside-avoid overflow-hidden rounded-2xl bg-slate-900/50 shadow-xl shadow-slate-950/40"
  >
    <div className="w-full animate-pulse bg-slate-800/60" style={{ aspectRatio: "3 / 2" }} />
    <div className="space-y-2 px-4 py-4">
      <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-800/80" />
      <div className="h-3 w-1/3 animate-pulse rounded-full bg-slate-800/60" />
    </div>
  </div>
);

export default SkeletonCard;
