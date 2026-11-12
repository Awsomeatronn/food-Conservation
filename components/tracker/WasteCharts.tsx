'use client'

import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart,
} from 'recharts'
import { TrendingUp, Leaf, AlertTriangle } from 'lucide-react'

interface WasteLog {
  logged_date: string
  purchased_kg: number
  wasted_kg: number
  people_fed: number
  food_purchased: string
}

interface Props {
  logs: WasteLog[]
}

function formatDate(d: string) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(d))
}

const TOOLTIP_STYLE = {
  backgroundColor: '#0f2318',
  border: '1px solid rgba(74,222,128,0.2)',
  borderRadius: '12px',
  color: '#86efac',
  fontSize: 12,
}

export default function WasteCharts({ logs }: Props) {
  if (logs.length === 0) return null

  // Sort by date
  const sorted = [...logs].sort((a, b) => a.logged_date.localeCompare(b.logged_date))

  // Aggregate by date
  const byDate = sorted.reduce<Record<string, { purchased: number; wasted: number; people: number; count: number }>>((acc, l) => {
    const d = l.logged_date
    if (!acc[d]) acc[d] = { purchased: 0, wasted: 0, people: 0, count: 0 }
    acc[d].purchased += Number(l.purchased_kg)
    acc[d].wasted += Number(l.wasted_kg)
    acc[d].people += Number(l.people_fed)
    acc[d].count += 1
    return acc
  }, {})

  const chartData = Object.entries(byDate).map(([date, v]) => ({
    date: formatDate(date),
    'Purchased (kg)': parseFloat(v.purchased.toFixed(2)),
    'Wasted (kg)': parseFloat(v.wasted.toFixed(2)),
    'Per-capita Waste (g)': parseFloat(((v.wasted / v.people) * 1000).toFixed(0)),
    'Waste %': parseFloat(((v.wasted / v.purchased) * 100).toFixed(1)),
  }))

  // Summary stats
  const totalPurchased = sorted.reduce((s, l) => s + Number(l.purchased_kg), 0)
  const totalWasted = sorted.reduce((s, l) => s + Number(l.wasted_kg), 0)
  const totalPeople = sorted.reduce((s, l) => s + Number(l.people_fed), 0)
  const wasteRate = totalPurchased > 0 ? ((totalWasted / totalPurchased) * 100).toFixed(1) : '0'
  const perCapita = totalPeople > 0 ? ((totalWasted / totalPeople) * 1000).toFixed(0) : '0'

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Purchased', val: `${totalPurchased.toFixed(1)} kg`, color: '#4ade80', Icon: Leaf },
          { label: 'Total Wasted', val: `${totalWasted.toFixed(1)} kg`, color: '#f87171', Icon: AlertTriangle },
          { label: 'Waste Rate', val: `${wasteRate}%`, color: '#fbbf24', Icon: TrendingUp },
          { label: 'Per-capita Waste', val: `${perCapita}g/person`, color: '#a78bfa', Icon: TrendingUp },
        ].map(({ label, val, color, Icon }) => (
          <div key={label} className="rounded-xl p-4"
            style={{ background: 'linear-gradient(135deg, #0f2318, #1a3a28)', border: '1px solid rgba(74,222,128,0.1)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} style={{ color }} />
              <span className="text-green-300/50 text-xs">{label}</span>
            </div>
            <span className="text-white font-bold text-lg" style={{ color }}>{val}</span>
          </div>
        ))}
      </div>

      {/* Bar chart: Purchased vs Wasted */}
      <div className="rounded-2xl p-5"
        style={{ background: 'linear-gradient(135deg, #0f2318, #1a3a28)', border: '1px solid rgba(74,222,128,0.1)' }}>
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400" />
          Purchased vs Wasted Over Time
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.08)" />
            <XAxis dataKey="date" tick={{ fill: '#86efac80', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#86efac80', fontSize: 11 }} axisLine={false} tickLine={false} unit=" kg" />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ color: '#86efac', fontSize: 12 }} />
            <Bar dataKey="Purchased (kg)" fill="#4ade80" radius={[6,6,0,0]} maxBarSize={40} />
            <Bar dataKey="Wasted (kg)" fill="#f87171" radius={[6,6,0,0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Area chart: Per-capita waste & waste % */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5"
          style={{ background: 'linear-gradient(135deg, #0f2318, #1a3a28)', border: '1px solid rgba(74,222,128,0.1)' }}>
          <h3 className="text-white font-semibold mb-4 text-sm flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-400" />
            Per-Capita Waste (g / person)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="pcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.08)" />
              <XAxis dataKey="date" tick={{ fill: '#86efac80', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#86efac80', fontSize: 10 }} axisLine={false} tickLine={false} unit="g" />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="Per-capita Waste (g)" stroke="#a78bfa" fill="url(#pcGrad)" strokeWidth={2} dot={{ fill: '#a78bfa', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl p-5"
          style={{ background: 'linear-gradient(135deg, #0f2318, #1a3a28)', border: '1px solid rgba(74,222,128,0.1)' }}>
          <h3 className="text-white font-semibold mb-4 text-sm flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            Waste Percentage (%)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.08)" />
              <XAxis dataKey="date" tick={{ fill: '#86efac80', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#86efac80', fontSize: 10 }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="Waste %" stroke="#fbbf24" strokeWidth={2} dot={{ fill: '#fbbf24', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
