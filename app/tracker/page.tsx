'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import WasteForm from '@/components/tracker/WasteForm';
import WasteCharts from '@/components/tracker/WasteCharts';
import { Loader2 } from 'lucide-react';

export default function TrackerPage() {
  const supabase = createClient();
  const { user, loading: authLoading } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    if (!user) {
      setLogs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('kitchen_waste_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('logged_date', { ascending: true });
    setLogs(data || []);
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => {
    if (!authLoading) fetchLogs();
  }, [authLoading, fetchLogs]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Kitchen Waste Tracker</h1>
        <p className="text-emerald-200/70 text-sm mt-1">
          Log daily food preparation and waste to monitor efficiency and reduce surplus.
        </p>
      </div>

      {!authLoading && !user ? (
        <div className="p-8 rounded-2xl bg-[#0c2115] border border-emerald-500/20 text-center">
          <p className="text-emerald-200">
            Please sign in using the button in the top right to log and track your kitchen waste analytics.
          </p>
        </div>
      ) : (
        <>
          <WasteForm onSaved={fetchLogs} />
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
            </div>
          ) : (
            <WasteCharts logs={logs} />
          )}
        </>
      )}
    </div>
  );
}
