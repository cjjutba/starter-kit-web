import { Card } from "@/components/primitives/surfaces";
import { Skeleton } from "@/components/ui/skeleton";

// What every screen under /app shows while its data loads, including the
// Neon cold start, which is real. A skeleton in the shape of a list rather
// than a spinner, as docs/design/states.md asks.

export default function Loading() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-busy="true">
      <span className="sr-only">Loading</span>
      <Skeleton className="h-8 w-40 rounded-tag bg-sheet" />
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((index) => (
          <Card key={index} className="flex flex-col gap-3 p-5">
            <Skeleton className="h-5 w-2/3 rounded-tag bg-field" />
            <Skeleton className="h-5 w-1/2 rounded-tag bg-field" />
          </Card>
        ))}
      </div>
    </div>
  );
}
