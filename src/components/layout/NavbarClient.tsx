'use client'

import Link from 'next/link'
import { User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface NavbarClientProps {
  user: { id: string; email?: string } | null
  avatarUrl: string | null
  logoutAction: () => Promise<void>
}

export function NavbarClient({ user, avatarUrl, logoutAction }: NavbarClientProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 9999,
      }}
    >
      <div className="navbar-inner">
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#FFED70' }}>AnimeDex</span>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#FFED70', borderRadius: '2px' }} />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-links">
          <Link href="/" style={{ color: '#E0E0E0', textDecoration: 'none' }}>Home</Link>
          <Link href="/buscar" style={{ color: '#B0B0B0', textDecoration: 'none' }}>Explore</Link>

          {user ? (
            <>
              <Link
                href="/perfil"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B0B0B0', textDecoration: 'none' }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#1A1A1A', border: '1px solid #333' }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User style={{ width: '16px', height: '16px', margin: '7px' }} />
                  )}
                </div>
              </Link>

              <form action={logoutAction} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#EF4444',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'inherit',
                  }}
                >
                  <span>Logout</span>
                  <LogOut style={{ width: '16px', height: '16px' }} />
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FFED70', textDecoration: 'none' }}
            >
              <span>Login</span>
              <User style={{ width: '16px', height: '16px' }} />
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="nav-mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen
            ? <X style={{ width: '24px', height: '24px' }} />
            : <Menu style={{ width: '24px', height: '24px' }} />
          }
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`nav-mobile-menu${menuOpen ? ' open' : ''}`}>
        <Link href="/" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link href="/buscar" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
          Explore
        </Link>

        {user ? (
          <>
            <Link href="/perfil" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
              {avatarUrl && (
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #333', flexShrink: 0 }}>
                  <img src={avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              My Profile
            </Link>
            <form action={logoutAction} style={{ margin: 0 }}>
              <button
                type="submit"
                className="nav-mobile-link"
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: '#EF4444',
                  fontFamily: 'inherit',
                  borderBottom: 'none',
                }}
              >
                <LogOut style={{ width: '16px', height: '16px' }} />
                Logout
              </button>
            </form>
          </>
        ) : (
          <Link href="/login" className="nav-mobile-link" style={{ color: '#FFED70' }} onClick={() => setMenuOpen(false)}>
            <User style={{ width: '16px', height: '16px' }} />
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
