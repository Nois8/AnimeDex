import { createClient } from '@/lib/supabase/server'

export interface CreateReviewParams {
  animeId: string;
  userId: string;
  content: string;
  rating: number;
}

export const ReviewService = {
  /**
   * Obtiene las reviews de un anime con los datos del perfil que la escribió.
   */
  async getAnimeReviews(animeId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        content,
        rating,
        created_at,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq('anime_id', animeId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error obteniendo reviews:', error)
      return []
    }

    return data
  },

  /**
   * Crea o actualiza una review (Upsert).
   * Como hay un UNIQUE constraint de (user_id, anime_id), si el usuario 
   * vuelve a enviar una review, podemos actualizar la existente.
   */
  async submitReview({ animeId, userId, content, rating }: CreateReviewParams) {
    const supabase = await createClient()

    // Validaciones de negocio (Adicional a las de BD)
    if (rating < 1 || rating > 5) {
      throw new Error('La puntuación debe estar entre 1 y 5 estrellas.')
    }
    if (content.length < 10) {
      throw new Error('La reseña debe tener al menos 10 caracteres.')
    }

    // Usamos upsert para actualizar si ya existía (onConflict)
    const { error } = await supabase
      .from('reviews')
      .upsert({
        anime_id: animeId,
        user_id: userId,
        content,
        rating,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id, anime_id'
      })

    if (error) {
      throw new Error(error.message)
    }
    
    // NOTA: No necesitamos recalcular el average_score aquí porque 
    // nuestro Trigger de PostgreSQL (recalculate_anime_score) lo hará mágicamente.
  },

  /**
   * Elimina una review
   */
  async deleteReview(animeId: string, userId: string) {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('anime_id', animeId)
      .eq('user_id', userId)

    if (error) throw new Error(error.message)
  },

  /**
   * Obtiene todas las reseñas escritas por un usuario en particular,
   * incluyendo los detalles del anime para dibujarlas en el perfil público.
   */
  async getUserReviews(userId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        content,
        rating,
        created_at,
        animes (
          external_id,
          title,
          cover_image
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error obteniendo reseñas del usuario:', error)
      return []
    }

    return data
  }
}
