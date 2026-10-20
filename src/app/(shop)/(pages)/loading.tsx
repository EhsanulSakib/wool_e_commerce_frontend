import { Container } from '@/components/ui/layout';
import { Skeleton } from '@/components/ui/Skeleton';

// Shown while a storefront page streams in: a heading and a product grid.
// In the (pages) group so routes that must answer with a real status code
// before streaming (a future catch-all calling notFound()) can live outside
// this loading boundary: after streaming starts, the status is always 200.
export default function Loading() {
  return (
    <Container size="wide" className="py-section-sm" aria-busy="true">
      <span className="sr-only" role="status">
        Loading…
      </span>
      <Skeleton shape="text" className="mb-3 w-1/3 text-h2" />
      <Skeleton shape="text" className="mb-10 w-1/2 text-body" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="grid gap-3">
            <Skeleton className="aspect-4/5 w-full" />
            <Skeleton shape="text" className="w-3/4 text-small" />
            <Skeleton shape="text" className="w-1/3 text-small" />
          </div>
        ))}
      </div>
    </Container>
  );
}
