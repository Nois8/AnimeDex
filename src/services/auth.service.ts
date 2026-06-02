import { createClient } from '@/lib/supabase/server'

// Definimos los tipos de entrada para mantener TypeScript estricto
export interface AuthParams {
  email: string
  password: string
}

export const AuthService = {
  async login({ email, password }: AuthParams) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw new Error(error.message)
    return data
  },

  async register({ email, password }: AuthParams, username: string) {
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username, // Esto lo recogerá el Trigger de SQL que creamos en la Fase 1
        },
      },
    })

    if (error) throw new Error(error.message)
    return data
  },

  async logout() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  }
}
