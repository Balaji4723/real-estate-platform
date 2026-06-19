export default function CardSkeleton() {
  return (
    <div className="border border-ink/10 dark:border-chalk/15 animate-pulse">
      <div className="aspect-[4/3] bg-ink/10 dark:bg-paper/10" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-ink/10 dark:bg-paper/10" />
        <div className="h-3 w-1/2 bg-ink/10 dark:bg-paper/10" />
        <div className="h-5 w-1/3 bg-ink/10 dark:bg-paper/10" />
        <div className="h-3 w-full bg-ink/10 dark:bg-paper/10" />
      </div>
    </div>
  );
}
