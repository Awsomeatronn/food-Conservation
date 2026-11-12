'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Mail, Loader2, CheckCircle2, Leaf } from 'lucide-react'

interface AuthModalProps {
  onClose: () => void
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<'email' | 'otp' | 'done'>('email')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function sendOtp() {
    if (!email.trim()) return setError('Please enter your email address.')
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    })
    setLoading(false)
    if (error) return setError(error.message)
    setStep('otp')
  }

  async function verifyOtp() {
    if (!otp.trim()) return setError('Please enter the 6-digit code.')
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: 'email',
    })
    setLoading(false)
    if (error) return setError('Invalid or expired code. Please try again.')
    setStep('done')
    setTimeout(() => onClose(), 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,20,15,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #0f2318 0%, #1a3a28 100%)', border: '1px solid rgba(74,222,128,0.2)' }}>

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 text-green-400/60 hover:text-green-300 transition-colors">
          <X size={22} />
        </button>

        <div className="p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #16a34a, #ca8a04)' }}>
              <Leaf size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-none">FoodShare</h2>
              <p className="text-green-400/70 text-xs">Bangalore</p>
            </div>
          </div>

          {step === 'done' ? (
            <div className="text-center py-6">
              <CheckCircle2 size={56} className="text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">You&apos;re in!</h3>
              <p className="text-green-300/70">Signing you in…</p>
            </div>
          ) : step === 'email' ? (
            <>
              <h3 className="text-white font-bold text-2xl mb-2">Welcome back</h3>
              <p className="text-green-300/60 text-sm mb-6">
                Enter your email to receive a one-time sign-in code.
              </p>

              <div className="mb-4">
                <label className="block text-green-300/80 text-sm font-medium mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendOtp()}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-green-300/30 outline-none transition-all text-sm"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(74,222,128,0.2)',
                    }}
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                {loading ? 'Sending code…' : 'Send Sign-In Code'}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setStep('email')}
                  className="text-green-400/60 hover:text-green-300 text-sm transition-colors">
                  ← Back
                </button>
              </div>
              <h3 className="text-white font-bold text-2xl mb-2">Check your inbox</h3>
              <p className="text-green-300/60 text-sm mb-6">
                We sent a 6-digit code to <span className="text-green-300 font-medium">{email}</span>.
                Enter it below.
              </p>

              <div className="mb-4">
                <label className="block text-green-300/80 text-sm font-medium mb-2">
                  Verification code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && verifyOtp()}
                  placeholder="123456"
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-green-300/30 outline-none text-center text-2xl font-mono tracking-widest"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(74,222,128,0.2)',
                  }}
                />
              </div>

              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

              <button
                onClick={verifyOtp}
                disabled={loading || otp.length < 6}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                {loading ? 'Verifying…' : 'Verify & Sign In'}
              </button>

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full mt-3 py-2 text-green-400/60 hover:text-green-300 text-sm transition-colors">
                Resend code
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
