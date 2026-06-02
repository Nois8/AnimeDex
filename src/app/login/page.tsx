'use client'

import { loginAction } from '@/controllers/auth.controller'
import { Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import { useState, useTransition } from 'react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    setError(null)
    startTransition(async () => {
      const res = await loginAction(formData)
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
          minHeight: '580px',
        }}
      >
        {/* ==================== LEFT: LOGIN FORM ==================== */}
        <div
          style={{
            backgroundColor: '#1A1A1A',
            borderRadius: '12px 0 0 12px',
            padding: '56px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '100%', maxWidth: '380px', margin: '0 auto' }}>
            {/* Avatar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginBottom: '20px',
                  border: '2px solid rgba(255,237,112,0.15)',
                  backgroundColor: '#2A2A2A',
                }}
              >
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=AnimeDex"
                  alt="Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px', textAlign: 'center' }}>
                Welcome back!
              </h1>
              <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', margin: 0 }}>
                Sign in to continue your anime journey
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div
                style={{
                  marginBottom: '24px',
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
            <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Email field */}
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

              {/* Password field */}
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
                  marginTop: '8px',
                  fontFamily: 'inherit',
                }}
              >
                {isPending ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Register link */}
            <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: '#888' }}>
              Don't have an account?{' '}
              <Link href="/register" style={{ color: '#FFED70', textDecoration: 'underline', fontWeight: 500 }}>
                Sign up
              </Link>
            </p>

            {/* Legal text */}
            <p
              style={{
                marginTop: '40px',
                textAlign: 'center',
                fontSize: '12px',
                color: '#555',
                lineHeight: 1.6,
                maxWidth: '300px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              By continuing, you agree to our Terms of Service and
              Privacy Policy
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
            src="/register-sky.png"
            alt="Anime Sky"
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
