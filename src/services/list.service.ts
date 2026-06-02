import { createClient } from '@/lib/supabase/server'
import { WatchlistUpdateParams } from '@/types/lists'

export const ListService = {
  // ==========================================
  // FAVORITOS
  // ==========================================

  async toggleFavorite(animeId: string, userId: string, isCurrentlyFavorite: boolean) {
    const supabase = await createClient()

    if (isCurrentlyFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('anime_id', animeId)
        .eq('user_id', userId)
      if (error) throw new Error(error.message)
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ anime_id: animeId, user_id: userId })
      if (error) throw new Error(error.message)
    }
  },

  async isFavorite(animeId: string, userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('favorites')
      .select('anime_id')
      .eq('anime_id', animeId)
      .eq('user_id', userId)
      .single()

    if (error || !data) return false
    return true
  },

  // ==========================================
  // WATCHLIST
  // ==========================================

  /**
   * Obtiene la entrada de la watchlist de un usuario para un anime específico.
   */
  async getWatchlistEntry(animeId: string, userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('watchlists')
      .select('*')
      .eq('anime_id', animeId)
      .eq('user_id', userId)
      .single()

    if (error) return null
    return data
  },

  /**
   * Actualiza o crea el estado de un anime en la watchlist.
   */
  async updateWatchlist({ animeId, userId, status, episodesWatched, userScore }: WatchlistUpdateParams) {
    const supabase = await createClient()

    // Obtener la entrada actual si existe
    const currentEntry = await this.getWatchlistEntry(animeId, userId)

    const payload = {
      anime_id: animeId,
      user_id: userId,
      status: status || currentEntry?.status || 'plan_to_watch',
      episodes_watched: episodesWatched !== undefined ? episodesWatched : currentEntry?.episodes_watched || 0,
      user_score: userScore !== undefined ? userScore : currentEntry?.user_score,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('watchlists')
      .upsert(payload, { onConflict: 'user_id, anime_id' })

    if (error) throw new Error(error.message)
  },

  async removeFromWatchlist(animeId: string, userId: string) {
    const supabase = await createClient()
    const { error } = await supabase
      .from('watchlists')
      .delete()
      .eq('anime_id', animeId)
      .eq('user_id', userId)

    if (error) throw new Error(error.message)
  },

  // ==========================================
  // PERFIL DE USUARIO
  // ==========================================

  async getUserFavorites(userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        anime_id,
        animes (
          external_id,
          title,
          cover_image,
          average_score
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) return []
    return data
  },

  async getUserWatchlist(userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('watchlists')
      .select(`
        status,
        episodes_watched,
        user_score,
        anime_id,
        animes (
          external_id,
          title,
          cover_image,
          average_score
        )
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) return []
    return data
  }
}
