import { createClient } from '@/lib/supabase/server'
import { logoutAction } from '@/controllers/auth.controller'
import { NavbarClient } from './NavbarClient'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let avatarUrl: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single()

    avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'Alex'}`
  }

  return (
    <NavbarClient
      user={user ? { id: user.id, email: user.email } : null}
      avatarUrl={avatarUrl}
      logoutAction={logoutAction}
    />
  )
}
