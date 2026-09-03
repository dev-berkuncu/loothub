import { getDeals } from '@/lib/db';
import DealsExplorer from '@/components/DealsExplorer';

// Ensure dynamic server-side rendering for fresh deals on every request
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { deals: initialDeals, total: initialTotal } = getDeals({
    limit: 30,
    sortBy: 'savings',
  });

  return <DealsExplorer initialDeals={initialDeals} initialTotal={initialTotal} />;
}
