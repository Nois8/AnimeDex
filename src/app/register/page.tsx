'use client'

import { registerAction } from '@/controllers/auth.controller'
import { Mail, Lock, User } from 'lucide-react'
import Link from 'next/link'
import { useState, useTransition } from 'react'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    setError(null)
    const password = formData.get('password') as string
    const confirm = formData.get('confirm_password') as string

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    startTransition(async () => {
      const res = await registerAction(formData)
      if (res?.error) {
        setError(res.error)
      }
    })
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px 14px 48px',
    backgroundColor: '#161616',
    color: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #2A2A2A',
    outline: 'none',
    fontSize: '14px',
    fontFamily: 'inherit',
  }

  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '18px',
    height: '18px',
    color: '#555',
  }

  return (
    <main
      style={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 56px 48px',
        backgroundColor: '#121212',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1100px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0px',
          alignItems: 'stretch',
          minHeight: '640px',
        }}
      >
        {/* ==================== LEFT: REGISTER FORM ==================== */}
        <div
          style={{
            backgroundColor: '#1A1A1A',
            borderRadius: '12px 0 0 12px',
            padding: '48px 56px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '100%', maxWidth: '380px', margin: '0 auto' }}>

            {/* Logo + Header */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '36px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#FFED70',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <span style={{ fontSize: '32px', fontWeight: 700, color: '#000', lineHeight: 1 }}>a</span>
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px', textAlign: 'center' }}>
                Join AnimeDex
              </h1>
              <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', margin: 0 }}>
                Create your account and discover the best anime
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div
                style={{
                  marginBottom: '20px',
                  padding: '14px',
                  backgroundColor: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '6px',
                  color: '#EF4444',
                  fontSize: '13px',
                  textAlign: 'center',
                }}
              >
                {error}
              </div>
            )}

            {/* Form */}
            <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Username */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="username" style={{ fontSize: '13px', fontWeight: 500, color: '#FFFFFF' }}>
                  Username
                </label>
                <div style={{ position: 'relative' }}>
                  <User style={iconStyle} />
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="otaku_pro"
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="email" style={{ fontSize: '13px', fontWeight: 500, color: '#FFFFFF' }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail style={iconStyle} />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="youremail@mail.com"
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="password" style={{ fontSize: '13px', fontWeight: 500, color: '#FFFFFF' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock style={iconStyle} />
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    style={{ ...inputStyle, letterSpacing: '2px' }}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="confirm_password" style={{ fontSize: '13px', fontWeight: 500, color: '#FFFFFF' }}>
                  Confirm password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock style={iconStyle} />
                  <input
                    type="password"
                    name="confirm_password"
                    id="confirm_password"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    style={{ ...inputStyle, letterSpacing: '2px' }}
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                disabled={isPending}
                type="submit"
                style={{
                  width: '100%',
                  height: '48px',
                  backgroundColor: '#FFED70',
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: '15px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: isPending ? 'not-allowed' : 'pointer',
                  opacity: isPending ? 0.7 : 1,
                  marginTop: '4px',
                  fontFamily: 'inherit',
                }}
              >
                {isPending ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            {/* Login link */}
            <p style={{ marginTop: '28px', textAlign: 'center', fontSize: '14px', color: '#888' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#FFED70', textDecoration: 'underline', fontWeight: 500 }}>
                Sign in
              </Link>
            </p>

            {/* Legal text */}
            <p
              style={{
                marginTop: '32px',
                textAlign: 'center',
                fontSize: '12px',
                color: '#555',
                lineHeight: 1.6,
                maxWidth: '300px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* ==================== RIGHT: IMAGE ==================== */}
        <div
          style={{
            position: 'relative',
            borderRadius: '0 12px 12px 0',
            overflow: 'hidden',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1510006764426-17b5f939eecb?q=80&w=1920&auto=format&fit=crop"
            alt="Blue Sky with Birds"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>
    </main>
  )
}
