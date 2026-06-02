import Link from 'next/link'
import { User, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { logoutAction } from '@/controllers/auth.controller'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let avatarUrl = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single()
    
    avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'Alex'}`
  }

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
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '24px 56px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#FFED70' }}>AnimeDex</span>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#FFED70', borderRadius: '2px' }} />
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', fontSize: '14px', fontWeight: 500 }}>
          <Link href="/" style={{ color: '#E0E0E0', textDecoration: 'none' }}>Home</Link>
          <Link href="/buscar" style={{ color: '#B0B0B0', textDecoration: 'none' }}>Explore</Link>
          
          {user ? (
            <>
              {/* Enlace al perfil con el avatar */}
              <Link href="/perfil" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B0B0B0', textDecoration: 'none' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#1A1A1A', border: '1px solid #333' }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User style={{ width: '16px', height: '16px', margin: '7px' }} />
                  )}
                </div>
              </Link>
              
              {/* Botón de Cerrar Sesión */}
              <form action={logoutAction} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#EF4444',
                    textDecoration: 'none',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    fontFamily: 'inherit'
                  }}
                >
                  <span>Logout</span>
                  <LogOut style={{ width: '16px', height: '16px' }} />
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FFED70', textDecoration: 'none' }}>
              <span>Login</span>
              <User style={{ width: '16px', height: '16px' }} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
