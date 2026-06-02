import { createBrowserClient } from '@supabase/ssr'

// Función para usar Supabase en "Client Components" (los que llevan "use client")
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
