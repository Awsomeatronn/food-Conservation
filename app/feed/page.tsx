'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import DonationCard from '@/components/feed/DonationCard';
import { Loader2, Utensils } from 'lucide-react';

export default function FeedPage() {
  const supabase = createClient();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('v_active_listings')
      .select('*')
      .order('created_at', { ascending: false });
    setListings(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Live Donators Feed</h1>
        <p className="text-emerald-200/70 text-sm mt-1">
          Real-time surplus food available for pickup across Bengaluru.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-emerald-400" />
        </div>
      ) : listings.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0c2115] border border-emerald-500/20 text-center space-y-2">
          <Utensils className="w-8 h-8 text-emerald-400 mx-auto" />
          <p className="text-white font-medium">No active surplus listings right now</p>
          <p className="text-sm text-emerald-200/70">
            Click &ldquo;Donate?&rdquo; in the top bar to post the first surplus batch.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <DonationCard key={listing.id} listing={listing} onMutate={fetchListings} />
          ))}
        </div>
      )}
    </div>
  );
}
