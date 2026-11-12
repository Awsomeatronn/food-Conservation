'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'
import { formatDate, getTimeRemaining, getInitials } from '@/lib/utils'
import { MapPin, Phone, Clock, Trash2, CheckCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface Listing {
  id: string
  title: string
  food_details: string | null
  quantity_desc: string | null
  address_line: string
  contact_phone: string | null
  prepared_at: string | null
  expires_at: string
  image_urls: string[]
  donor_id: string
  donor_name: string | null
  donor_avatar: string | null
  donor_full_name: string | null
  donor_display_name: string | null
  status: string
}

interface Props {
  listing: Listing
  onMutate: () => void
}

export default function DonationCard({ listing, onMutate }: Props) {
  const supabase = createClient()
  const { user } = useAuth()
  const [timeInfo, setTimeInfo] = useState(() => getTimeRemaining(listing.expires_at))
  const [acting, setActing] = useState(false)

  const isOwner = user?.id === listing.donor_id
  const donorName = listing.donor_name || listing.donor_display_name || listing.donor_full_name || 'Anonymous'
  const avatarUrl = listing.donor_avatar
  const image = listing.image_urls?.[0] ?? null

  useEffect(() => {
    setTimeInfo(getTimeRemaining(listing.expires_at))
    const interval = setInterval(() => {
      setTimeInfo(getTimeRemaining(listing.expires_at))
    }, 60_000)
    return () => clearInterval(interval)
  }, [listing.expires_at])

  const badgeStyle =
    timeInfo.status === 'fresh'
      ? { bg: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.4)', text: '#4ade80', dot: '#4ade80' }
      : timeInfo.status === 'soon'
      ? { bg: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', text: '#fbbf24', dot: '#fbbf24' }
      : { bg: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.4)', text: '#f87171', dot: '#f87171' }

  async function markClaimed() {
    setActing(true)
    await supabase.from('food_listings').update({ status: 'completed' }).eq('id', listing.id)
    setActing(false)
    onMutate()
  }

  async function deleteListing() {
    if (!confirm('Delete this donation listing?')) return
    setActing(true)
    await supabase.from('food_listings').delete().eq('id', listing.id)
    setActing(false)
    onMutate()
  }

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-2xl"
      style={{ background: 'linear-gradient(135deg, #0f2318, #1a3a28)', border: '1px solid rgba(74,222,128,0.12)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
      {/* Card header: avatar + name + title */}
      <div className="flex items-center gap-3 p-4 pb-3"
        style={{ borderBottom: '1px solid rgba(74,222,128,0.08)' }}>
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, #16a34a, #ca8a04)', color: 'white' }}>
          {avatarUrl
            ? <Image src={avatarUrl} alt={donorName} width={40} height={40} className="object-cover w-full h-full" />
            : getInitials(donorName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-green-300/60 text-xs">{donorName}</p>
          <h3 className="text-white font-bold text-sm leading-tight truncate">{listing.title}</h3>
        </div>
        {/* Freshness badge */}
        <div className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background: badgeStyle.bg, border: badgeStyle.border, color: badgeStyle.text }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: badgeStyle.dot }} />
          {timeInfo.label}
        </div>
      </div>

      {/* Food image */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <Image src={image} alt="food" fill className="object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0f2318 0%, transparent 60%)' }} />
        </div>
      )}

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Food details */}
        {listing.food_details && (
          <p className="text-green-300/70 text-sm leading-relaxed line-clamp-3">{listing.food_details}</p>
        )}
        {listing.quantity_desc && (
          <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-lg w-fit"
            style={{ background: 'rgba(74,222,128,0.1)', color: '#86efac' }}>
            📦 {listing.quantity_desc}
          </span>
        )}

        {/* Address */}
        <div className="flex items-start gap-2">
          <MapPin size={13} className="text-green-400/60 mt-0.5 flex-shrink-0" />
          <span className="text-green-300/60 text-xs leading-relaxed">{listing.address_line}</span>
        </div>

        {/* Phone */}
        {listing.contact_phone && (
          <a href={`tel:${listing.contact_phone}`}
            className="flex items-center gap-2 text-green-300/60 hover:text-green-300 transition-colors">
            <Phone size={13} className="flex-shrink-0" />
            <span className="text-xs">{listing.contact_phone}</span>
          </a>
        )}

        {/* Timestamps */}
        <div className="space-y-1 mt-1 pt-3"
          style={{ borderTop: '1px solid rgba(74,222,128,0.08)' }}>
          {listing.prepared_at && (
            <div className="flex items-center gap-2 text-xs text-green-300/40">
              <Clock size={11} />
              <span>Prepared: {formatDate(listing.prepared_at)}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs" style={{ color: badgeStyle.text }}>
            <Clock size={11} />
            <span>Expires: {formatDate(listing.expires_at)}</span>
          </div>
        </div>

        {/* Owner actions */}
        {isOwner && (
          <div className="flex gap-2 mt-2">
            <button onClick={markClaimed} disabled={acting}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80' }}>
              {acting ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
              Mark Claimed
            </button>
            <button onClick={deleteListing} disabled={acting}
              className="flex items-center justify-center px-3 py-2 rounded-lg text-xs transition-all"
              style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171' }}>
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
