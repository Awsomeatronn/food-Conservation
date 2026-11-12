'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { getInitials } from '@/lib/utils'
import { LogOut, User, Camera, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function ProfileMenu() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editName, setEditName] = useState(false)
  const [nameVal, setNameVal] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  if (!user || !profile) return null

  const displayName = profile.display_name || profile.full_name || 'User'

  async function uploadAvatar(file: File) {
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${user!.id}/avatar.${ext}`
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (upErr) throw upErr
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', user!.id)
      await refreshProfile()
    } catch (e) { console.error(e) }
    setUploading(false)
  }

  async function saveName() {
    if (!nameVal.trim()) return
    await supabase.from('profiles').update({ display_name: nameVal.trim() }).eq('id', user!.id)
    await refreshProfile()
    setEditName(false)
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-full px-2 py-1 transition-all hover:bg-white/5">
        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-sm font-bold"
          style={{ background: 'linear-gradient(135deg, #16a34a, #ca8a04)', color: 'white' }}>
          {profile.avatar_url
            ? <Image src={profile.avatar_url} alt="avatar" width={32} height={32} className="object-cover w-full h-full" />
            : getInitials(displayName)}
        </div>
        <span className="hidden md:block text-green-300 text-sm font-medium max-w-[120px] truncate">
          {displayName}
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl shadow-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0f2318, #1a3a28)', border: '1px solid rgba(74,222,128,0.2)' }}>
            {/* Profile header */}
            <div className="p-5 flex items-center gap-4"
              style={{ borderBottom: '1px solid rgba(74,222,128,0.1)' }}>
              <div className="relative">
                <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center text-xl font-bold"
                  style={{ background: 'linear-gradient(135deg, #16a34a, #ca8a04)', color: 'white' }}>
                  {profile.avatar_url
                    ? <Image src={profile.avatar_url} alt="avatar" width={56} height={56} className="object-cover w-full h-full" />
                    : getInitials(displayName)}
                </div>
                <button onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: '#16a34a' }}>
                  {uploading ? <Loader2 size={12} className="text-white animate-spin" /> : <Camera size={12} className="text-white" />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => e.target.files?.[0] && uploadAvatar(e.target.files[0])} />
              </div>
              <div className="flex-1 min-w-0">
                {editName ? (
                  <div className="flex gap-1">
                    <input value={nameVal} onChange={e => setNameVal(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveName()}
                      autoFocus
                      className="flex-1 text-white text-sm bg-white/10 rounded px-2 py-1 outline-none border border-green-400/30" />
                    <button onClick={saveName} className="text-green-400 text-xs font-semibold px-1">Save</button>
                  </div>
                ) : (
                  <button onClick={() => { setNameVal(displayName); setEditName(true) }}
                    className="text-left group w-full">
                    <p className="text-white font-semibold text-sm truncate group-hover:text-green-300 transition-colors">
                      {displayName}
                    </p>
                    <p className="text-green-400/50 text-[11px]">tap to edit name</p>
                  </button>
                )}
                <p className="text-green-300/50 text-xs truncate mt-0.5">{profile.email}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-green-300/60 hover:text-green-300 hover:bg-white/5 transition-all">
                <User size={16} />
                Your Profile
              </button>
              <button onClick={() => { signOut(); setOpen(false) }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all">
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
