import Link from 'next/link';
import { Leaf, BarChart3, HeartHandshake, Radio } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <section className="rounded-3xl p-8 sm:p-12 border border-emerald-500/20 bg-gradient-to-br from-[#0d2618] via-[#0a1f12] to-[#132a12]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-medium mb-4">
          <Leaf className="w-3.5 h-3.5" /> Bengaluru Community Food Rescue Network
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight max-w-3xl">
          Turn Kitchen Surplus into Meals Across Bengaluru.
        </h1>
        <p className="mt-4 text-emerald-100/80 text-base sm:text-lg max-w-2xl leading-relaxed">
          Every day, households, restaurants, and event venues across Bengaluru discard edible food while thousands go hungry. Track your daily kitchen waste, connect directly with verified local NGOs, or publish real-time surplus pickups.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/donate#form"
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold transition"
          >
            Donate Surplus Food
          </Link>
          <Link
            href="/tracker"
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-emerald-400/20 text-emerald-200 font-medium transition"
          >
            Open Waste Tracker
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#0c2115] border border-emerald-500/15">
          <BarChart3 className="w-8 h-8 text-emerald-400 mb-3" />
          <h2 className="text-lg font-semibold text-white">1. Kitchen Waste Tracker</h2>
          <p className="mt-2 text-sm text-emerald-200/75">
            Log household or restaurant food purchased vs. wasted and visualize waste trends and efficiency over time.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-[#0c2115] border border-emerald-500/15">
          <HeartHandshake className="w-8 h-8 text-emerald-400 mb-3" />
          <h2 className="text-lg font-semibold text-white">2. Bengaluru NGO Directory</h2>
          <p className="mt-2 text-sm text-emerald-200/75">
            Reach Robin Hood Army, Feeding India, No Food Waste, Akshaya Patra, Aahwahan, and Hosabelaku Trust directly.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-[#0c2115] border border-emerald-500/15">
          <Radio className="w-8 h-8 text-emerald-400 mb-3" />
          <h2 className="text-lg font-semibold text-white">3. Live Donators Feed</h2>
          <p className="mt-2 text-sm text-emerald-200/75">
            Broadcast time-sensitive food batches with live countdown timers, pickup locations, and instant claim updates.
          </p>
        </div>
      </section>
    </div>
  );
}
