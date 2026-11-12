'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'
import { Loader2, Upload, X, Heart, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

export default function DonationForm() {
  const supabase = createClient()
  const { user, profile } = useAuth()
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    food_details: '',
    quantity_desc: '',
    prepared_at: '',
    expires_at: '',
    address_line: '',
    contact_phone: '',
    donor_name: profile?.display_name || profile?.full_name || '',
  })

  // Keep donor_name in sync with profile once loaded
  const donorNameVal = form.donor_name || profile?.display_name || profile?.full_name || ''

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function handleImage(file: File) {
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = e => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setError('')

    if (!form.title.trim()) return setError('Please enter a donation title.')
    if (!form.food_details.trim()) return setError('Please describe what food you\'re donating.')
    if (!form.expires_at) return setError('Please set an expiry time.')
    if (!form.address_line.trim()) return setError('Please enter a pickup address.')
    if (!form.contact_phone.trim()) return setError('Please enter a contact phone number.')

    setLoading(true)
    try {
      let imageUrl: string | null = null

      if (imageFile) {
        const ext = imageFile.name.split('.').pop()
        const path = `${user.id}/${Date.now()}.${ext}`
        const { error: upErr } = await supabase.storage.from('food-images').upload(path, imageFile)
        if (upErr) throw upErr
        const { data } = supabase.storage.from('food-images').getPublicUrl(path)
        imageUrl = data.publicUrl
      }

      const { error: dbErr } = await supabase.from('food_listings').insert({
        donor_id: user.id,
        title: form.title.trim(),
        food_details: form.food_details.trim(),
        quantity_desc: form.quantity_desc.trim() || null,
        description: form.food_details.trim(),
        quantity: 1,
        quantity_unit: 'portion',
        address_line: form.address_line.trim(),
        city: 'Bangalore',
        state: 'Karnataka',
        prepared_at: form.prepared_at || null,
        expires_at: form.expires_at,
        status: 'available',
        image_urls: imageUrl ? [imageUrl] : [],
        donor_name: donorNameVal,
        contact_phone: form.contact_phone.trim(),
      })

      if (dbErr) throw dbErr
      router.push('/feed')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(msg)
    }
    setLoading(false)
  }

  return (
    <form id="form" onSubmit={handleSubmit}
      className="rounded-2xl p-6"
      style={{ background: 'linear-gradient(135deg, #0f2318, #1a3a28)', border: '1px solid rgba(74,222,128,0.15)' }}>
      <h2 className="text-white font-bold text-2xl mb-2 flex items-center gap-3">
        <Heart size={24} className="text-amber-400 fill-amber-400" />
        Create a Donation
      </h2>
      <p className="text-green-300/50 text-sm mb-6">Your listing will appear live on the Donators Feed.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-green-300/70 text-sm font-medium mb-2">Donation Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            placeholder='e.g. "Party leftovers to spare" or "Fresh rice and dal"'
            className="w-full px-4 py-3 rounded-xl text-white placeholder-green-300/25 outline-none text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.2)' }} />
        </div>

        {/* Food details */}
        <div className="md:col-span-2">
          <label className="block text-green-300/70 text-sm font-medium mb-2">Food Details *</label>
          <textarea rows={3} value={form.food_details} onChange={e => set('food_details', e.target.value)}
            placeholder="Describe what you're donating — type of food, any allergens, dietary info (e.g. veg/non-veg)…"
            className="w-full px-4 py-3 rounded-xl text-white placeholder-green-300/25 outline-none text-sm resize-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.2)' }} />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-green-300/70 text-sm font-medium mb-2">Approximate Quantity</label>
          <input value={form.quantity_desc} onChange={e => set('quantity_desc', e.target.value)}
            placeholder='e.g. "~5 kg" or "Serves 10 people"'
            className="w-full px-4 py-3 rounded-xl text-white placeholder-green-300/25 outline-none text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.2)' }} />
        </div>

        {/* Donor name */}
        <div>
          <label className="block text-green-300/70 text-sm font-medium mb-2">Donor Name</label>
          <input value={donorNameVal} onChange={e => set('donor_name', e.target.value)}
            placeholder="Your name or organisation"
            className="w-full px-4 py-3 rounded-xl text-white placeholder-green-300/25 outline-none text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.2)' }} />
        </div>

        {/* Prepared at */}
        <div>
          <label className="block text-green-300/70 text-sm font-medium mb-2">Time Prepared</label>
          <input type="datetime-local" value={form.prepared_at} onChange={e => set('prepared_at', e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.2)', colorScheme: 'dark' }} />
        </div>

        {/* Expires at */}
        <div>
          <label className="block text-green-300/70 text-sm font-medium mb-2">Expires / Goes Bad At *</label>
          <input type="datetime-local" value={form.expires_at} onChange={e => set('expires_at', e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.2)', colorScheme: 'dark' }} />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-green-300/70 text-sm font-medium mb-2">Pickup Address, Bangalore *</label>
          <input value={form.address_line} onChange={e => set('address_line', e.target.value)}
            placeholder="e.g. 12, 5th Cross, Indiranagar, Bangalore - 560038"
            className="w-full px-4 py-3 rounded-xl text-white placeholder-green-300/25 outline-none text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.2)' }} />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-green-300/70 text-sm font-medium mb-2">Contact Phone *</label>
          <input type="tel" value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full px-4 py-3 rounded-xl text-white placeholder-green-300/25 outline-none text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.2)' }} />
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-green-300/70 text-sm font-medium mb-2">Food Photo (optional)</label>
          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden h-24">
              <Image src={imagePreview} alt="preview" fill className="object-cover" />
              <button type="button" onClick={() => { setImageFile(null); setImagePreview(null) }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
                <X size={12} className="text-white" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()}
              className="w-full h-24 rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:border-green-400/40"
              style={{ border: '2px dashed rgba(74,222,128,0.2)', background: 'rgba(255,255,255,0.02)' }}>
              <ImageIcon size={20} className="text-green-400/40" />
              <span className="text-green-300/40 text-xs">Click to upload photo</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => e.target.files?.[0] && handleImage(e.target.files[0])} />
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm mt-5 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(248,113,113,0.1)' }}>{error}</p>
      )}

      <button type="submit" disabled={loading}
        className="w-full mt-6 py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60 hover:scale-[1.02] active:scale-100"
        style={{ background: 'linear-gradient(135deg, #ca8a04, #d97706)', boxShadow: '0 4px 20px rgba(202,138,4,0.35)' }}>
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Heart size={18} className="fill-white" />}
        {loading ? 'Posting…' : 'Post Donation'}
      </button>
    </form>
  )
}
