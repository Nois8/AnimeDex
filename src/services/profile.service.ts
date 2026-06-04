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
   * Busca perfiles de usuario por su username.
   */
  async searchUsers(query: string, page: number = 1, limit: number = 20) {
    if (!query) return { data: [], count: 0, hasNextPage: false }

    const supabase = await createClient()

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, bio, created_at', { count: 'exact' })
      .ilike('username', `%${query}%`)
      .range(from, to)

    if (error) {
      console.error('Error searching users:', error.message)
      return { data: [], count: 0, hasNextPage: false }
    }

    const hasNextPage = count ? (from + limit) < count : false;

    return {
      data: data || [],
      count: count || 0,
      hasNextPage
    }
  },

  /**
   * Obtiene la lista de usuarios que siguen a un usuario específico.
   */
  async getFollowers(userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('follows')
      .select('profiles!follower_id(id, username, avatar_url, bio, created_at)')
      .eq('following_id', userId)

    if (error) {
      console.error('Error fetching followers:', error.message)
      return []
    }

    // Aplanar el resultado
    return data.map((item: any) => item.profiles)
  },

  /**
   * Obtiene la lista de usuarios a los que sigue un usuario específico.
   */
  async getFollowing(userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('follows')
      .select('profiles!following_id(id, username, avatar_url, bio, created_at)')
      .eq('follower_id', userId)

    if (error) {
      console.error('Error fetching following:', error.message)
      return []
    }

    // Aplanar el resultado
    return data.map((item: any) => item.profiles)
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
   * Verifica en lote si el usuario autenticado sigue a una lista de usuarios (Evita N+1).
   * Devuelve un objeto donde la key es el ID del usuario y el valor es un boolean.
   */
  async getFollowingStatusesBatch(followerId: string, followingIds: string[]) {
    if (!followingIds || followingIds.length === 0) return {}
    
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', followerId)
      .in('following_id', followingIds)

    if (error) {
      console.error('Error in getFollowingStatusesBatch:', error.message)
      return {}
    }

    const followingSet = new Set(data?.map(d => d.following_id) || [])
    
    return Object.fromEntries(
      followingIds.map(id => [id, followingSet.has(id)])
    )
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
