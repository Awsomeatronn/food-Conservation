'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'
import { Loader2, PlusCircle, ChefHat, Home } from 'lucide-react'

interface Props {
  onSaved: () => void
}

const FOOD_TYPES = [
  'Rice & Lentils', 'Vegetables', 'Fruits', 'Roti / Bread', 'Meat / Poultry',
  'Dairy', 'Snacks', 'Leftovers / Cooked Meals', 'Raw Ingredients', 'Other',
]

export default function WasteForm({ onSaved }: Props) {
  const supabase = createClient()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    account_type: 'household',
    logged_date: new Date().toISOString().split('T')[0],
    people_fed: '',
    food_purchased: FOOD_TYPES[0],
    purchased_kg: '',
    wasted_kg: '',
  })

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setError('')

    const purchased = parseFloat(form.purchased_kg)
    const wasted = parseFloat(form.wasted_kg)
    const people = parseInt(form.people_fed)

    if (isNaN(purchased) || purchased < 0) return setError('Enter a valid purchased weight.')
    if (isNaN(wasted) || wasted < 0) return setError('Enter a valid wasted weight.')
    if (wasted > purchased) return setError('Wasted cannot exceed purchased weight.')
    if (isNaN(people) || people < 1) return setError('Enter number of people fed (at least 1).')

    setLoading(true)
    const { error: dbErr } = await supabase.from('kitchen_waste_logs').insert({
      user_id: user.id,
      account_type: form.account_type,
      logged_date: form.logged_date,
      people_fed: people,
      food_purchased: form.food_purchased,
      purchased_kg: purchased,
      wasted_kg: wasted,
    })
    setLoading(false)
    if (dbErr) return setError(dbErr.message)

    setForm(f => ({ ...f, people_fed: '', purchased_kg: '', wasted_kg: '' }))
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit}
      className="rounded-2xl p-6"
      style={{ background: 'linear-gradient(135deg, #0f2318, #1a3a28)', border: '1px solid rgba(74,222,128,0.15)' }}>
      <h2 className="text-white font-bold text-xl mb-5 flex items-center gap-2">
        <PlusCircle size={20} className="text-green-400" />
        Log Today&apos;s Meal
      </h2>

      {/* Account type */}
      <div className="mb-5">
        <label className="block text-green-300/70 text-sm font-medium mb-2">Account Type</label>
        <div className="flex gap-3">
          {[
            { val: 'household', label: 'Household', Icon: Home },
            { val: 'restaurant', label: 'Restaurant / Kitchen', Icon: ChefHat },
          ].map(({ val, label, Icon }) => (
            <button key={val} type="button"
              onClick={() => set('account_type', val)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 justify-center ${
                form.account_type === val
                  ? 'text-green-300'
                  : 'text-green-300/40 hover:text-green-300/70'
              }`}
              style={form.account_type === val
                ? { background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.4)' }
                : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(74,222,128,0.1)' }}>
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {/* Date */}
        <div>
          <label className="block text-green-300/70 text-sm font-medium mb-2">Date</label>
          <input type="date" value={form.logged_date}
            max={new Date().toISOString().split('T')[0]}
            onChange={e => set('logged_date', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.2)', colorScheme: 'dark' }} />
        </div>

        {/* People fed */}
        <div>
          <label className="block text-green-300/70 text-sm font-medium mb-2">People Fed</label>
          <input type="number" min="1" value={form.people_fed} placeholder="e.g. 4"
            onChange={e => set('people_fed', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-white text-sm placeholder-green-300/25 outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.2)' }} />
        </div>

        {/* Food type */}
        <div>
          <label className="block text-green-300/70 text-sm font-medium mb-2">Food / Ingredients</label>
          <select value={form.food_purchased} onChange={e => set('food_purchased', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.2)', colorScheme: 'dark' }}>
            {FOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Purchased kg */}
        <div>
          <label className="block text-green-300/70 text-sm font-medium mb-2">Purchased (kg)</label>
          <input type="number" min="0" step="0.1" value={form.purchased_kg} placeholder="e.g. 2.5"
            onChange={e => set('purchased_kg', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-white text-sm placeholder-green-300/25 outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.2)' }} />
        </div>

        {/* Wasted kg */}
        <div className="sm:col-span-2">
          <label className="block text-green-300/70 text-sm font-medium mb-2">Food Wasted (kg)</label>
          <input type="number" min="0" step="0.1" value={form.wasted_kg} placeholder="e.g. 0.3"
            onChange={e => set('wasted_kg', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-white text-sm placeholder-green-300/25 outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.2)' }} />
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-4 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(248,113,113,0.1)' }}>{error}</p>
      )}

      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60 hover:scale-[1.02] active:scale-100"
        style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 4px 15px rgba(22,163,74,0.3)' }}>
        {loading ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />}
        {loading ? 'Saving…' : 'Log Entry'}
      </button>
    </form>
  )
}
