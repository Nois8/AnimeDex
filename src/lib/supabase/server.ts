import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Función para usar Supabase en "Server Components", "Server Actions" o "Route Handlers"
export const createClient = async () => {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Este try-catch es necesario porque a veces intentamos actualizar cookies
            // desde un Server Component que ya ha empezado a enviar HTML.
          }
        },
      },
    }
  )
}
