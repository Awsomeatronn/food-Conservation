'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import AuthModal from './AuthModal'
import ProfileMenu from '@/components/profile/ProfileMenu'
import { Leaf, Menu, X, Heart } from 'lucide-react'

const TABS = [
  { label: 'About', href: '/about' },
  { label: 'Kitchen Waste Tracker', href: '/tracker' },
  { label: 'Donation Sources', href: '/donate' },
  { label: 'Donators Feed', href: '/feed' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleDonate() {
    if (!user) { setShowAuth(true); return }
    router.push('/donate#form')
  }

  return (
    <>
      {/* ── Top Bar ─────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-40"
        style={{ background: 'linear-gradient(135deg, #0a1f12 0%, #0f2a1a 60%, #1a2f0f 100%)' }}>

        {/* Donate CTA strip */}
        <div className="flex items-center justify-center py-2 px-4 gap-3"
          style={{ background: 'linear-gradient(90deg, rgba(202,138,4,0.15), rgba(202,138,4,0.08), rgba(202,138,4,0.15))', borderBottom: '1px solid rgba(202,138,4,0.2)' }}>
          <span className="text-amber-300/70 text-sm hidden sm:block">
            Have surplus food? Help your community.
          </span>
          <button
            onClick={handleDonate}
            className="flex items-center gap-2 px-5 py-1.5 rounded-full font-bold text-sm transition-all hover:scale-105 active:scale-95 animate-pulse"
            style={{ background: 'linear-gradient(135deg, #ca8a04, #d97706)', color: 'white', boxShadow: '0 0 20px rgba(202,138,4,0.4)' }}>
            <Heart size={14} className="fill-white" />
            Donate?
          </button>
        </div>

        {/* Nav row */}
        <div className="flex items-center justify-between px-4 md:px-8 py-3"
          style={{ borderBottom: '1px solid rgba(74,222,128,0.1)' }}>
          {/* Logo */}
          <Link href="/about" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #16a34a, #ca8a04)' }}>
              <Leaf size={16} className="text-white" />
            </div>
            <div className="leading-none">
              <span className="text-white font-bold text-base tracking-tight">FoodShare</span>
              <span className="block text-green-400/60 text-[10px] font-medium">Bangalore</span>
            </div>
          </Link>

          {/* Desktop tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {TABS.map(tab => {
              const active = pathname === tab.href || pathname.startsWith(tab.href + '/')
              return (
                <Link key={tab.href} href={tab.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'text-green-300'
                      : 'text-green-300/50 hover:text-green-300/80 hover:bg-white/5'
                  }`}
                  style={active ? { background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.2)' } : {}}>
                  {tab.label}
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {!loading && (
              user
                ? <ProfileMenu />
                : <button
                    onClick={() => setShowAuth(true)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                    style={{ border: '1px solid rgba(74,222,128,0.4)', color: '#86efac', background: 'rgba(74,222,128,0.08)' }}>
                    Sign In
                  </button>
            )}
            {/* Mobile hamburger */}
            <button className="md:hidden text-green-300/60 hover:text-green-300"
              onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden px-4 pb-4 space-y-1"
            style={{ background: '#0a1f12', borderBottom: '1px solid rgba(74,222,128,0.1)' }}>
            {TABS.map(tab => {
              const active = pathname === tab.href
              return (
                <Link key={tab.href} href={tab.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active ? 'text-green-300' : 'text-green-300/50'
                  }`}
                  style={active ? { background: 'rgba(74,222,128,0.12)' } : {}}>
                  {tab.label}
                </Link>
              )
            })}
          </nav>
        )}
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}
