import { createClient } from '@/lib/supabase/server'

export const ProfileService = {
  /**
   * Obtiene un perfil público por su username.
   * Incluye el conteo de seguidores y seguidos usando relaciones de Supabase.
   */
  async getProfileByUsername(username: string) {
    const supabase = await createClient()

    // En Supabase podemos hacer joins y pedir conteos ('count')
    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        id,
        username,
        avatar_url,
        bio,
        created_at,
        followers:follows!following_id(count),
        following:follows!follower_id(count)
      `)
      .eq('username', username)
      .maybeSingle()

    if (error) {
      console.error('Error fetching profile:', error.message)
      return null
    }

    if (!profile) {
      return null
    }

    return {
      ...profile,
      // Supabase devuelve el count dentro de un array de objetos cuando usamos relaciones
      followersCount: profile.followers?.[0]?.count || 0,
      followingCount: profile.following?.[0]?.count || 0
    }
  },

  /**
   * Verifica si el usuario autenticado sigue a otro usuario.
   */
  async isFollowing(followerId: string, followingId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle()

    // Si hay error (como PGN000 / row not found) o no hay data, significa que no lo sigue
    if (error || !data) return false

    return true
  },

  /**
   * Acción para seguir a un usuario.
   */
  async follow(followerId: string, followingId: string) {
    const supabase = await createClient()

    if (followerId === followingId) {
      throw new Error('No puedes seguirte a ti mismo')
    }

    const { error } = await supabase
      .from('follows')
      .insert({ follower_id: followerId, following_id: followingId })

    if (error) {
      // Ignoramos el error si ya lo seguía (violación de primary key)
      if (error.code !== '23505') { 
        throw new Error(error.message)
      }
    }
  },

  /**
   * Acción para dejar de seguir a un usuario.
   */
  async unfollow(followerId: string, followingId: string) {
    const supabase = await createClient()

    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId)

    if (error) throw new Error(error.message)
  }
}
