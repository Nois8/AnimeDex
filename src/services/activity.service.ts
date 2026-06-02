import { createClient } from '@/lib/supabase/server'

export const ActivityService = {
  /**
   * Obtiene el feed social del usuario autenticado.
   * Esto trae la actividad de todas las personas a las que sigue.
   */
  async getFollowingFeed(userId: string, limit: number = 20) {
    const supabase = await createClient()

    // 1. Obtener los IDs de las personas a las que sigo
    const { data: follows, error: followsError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId)

    if (followsError) {
      console.error('Error fetching follows:', followsError)
      return []
    }

    const followingIds = follows.map(f => f.following_id)

    // Si no sigo a nadie, mi feed está vacío
    if (followingIds.length === 0) {
      return []
    }

    // 2. Obtener las actividades de esos usuarios ordenadas por más reciente
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select(`
        id,
        action_type,
        metadata,
        created_at,
        profiles (
          username,
          avatar_url
        ),
        animes (
          external_id,
          title,
          cover_image
        )
      `)
      .in('user_id', followingIds)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError)
      return []
    }

    return activities
  }
}
