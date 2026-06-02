import { createClient } from '@/lib/supabase/server'
import { JikanAnimeResponse, DatabaseAnime, JikanSearchResponse } from '@/types/anime'

export const AnimeService = {
  /**
   * Obtiene un anime por su ID de MyAnimeList.
   * Flujo de sincronización:
   * 1. Busca en Supabase. Si existe, lo devuelve.
   * 2. Si NO existe, consulta a Jikan API.
   * 3. Lo guarda en Supabase (caché/persistencia) y lo devuelve.
   */
  async getAnimeByExternalId(externalId: number): Promise<DatabaseAnime | null> {
    const supabase = await createClient()

    // 1. Buscar en nuestra base de datos
    const { data: localAnime, error: localError } = await supabase
      .from('animes')
      .select('*')
      .eq('external_id', externalId)
      .single()

    // Si ya lo tenemos guardado, lo devolvemos (ahorramos llamadas a Jikan y es mucho más rápido)
    if (localAnime) {
      return localAnime as DatabaseAnime
    }

    // 2. Si no existe, lo buscamos en la API de Jikan
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime/${externalId}`)
      
      if (!response.ok) {
        if (response.status === 404) return null
        throw new Error(`Jikan API Error: ${response.statusText}`)
      }

      const jikanData: JikanAnimeResponse = await response.json()
      const anime = jikanData.data

      // Transformar puntuación de Jikan (1-10) a nuestra escala (1-5) si quisiéramos,
      // pero el requirement inicial dice que nosotros usaremos 1-5 para NUESTRAS reviews.
      // El score de la tabla "animes" representa *nuestro* average_score, así que empieza en 0.
      
      const newAnime = {
        external_id: anime.mal_id,
        title: anime.title,
        synopsis: anime.synopsis,
        cover_image: anime.images.webp.large_image_url,
        average_score: 0, // Inicia en 0 hasta que los usuarios hagan reviews
        total_reviews: 0
      }

      // 3. Guardar en Supabase
      const { data: insertedAnime, error: insertError } = await supabase
        .from('animes')
        .insert(newAnime)
        .select()
        .single()

      if (insertError) {
        console.error('Error insertando anime en Supabase:', insertError)
        throw new Error(`Error de Supabase: ${insertError.message}`)
      }

      return insertedAnime as DatabaseAnime

    } catch (error: any) {
      console.error('Error en AnimeService.getAnimeByExternalId:', error)
      throw error // Lanzamos el error hacia la página
    }
  },

  // ==========================================
  // BUSCADOR Y LISTADOS (JIKAN API DIRECTO)
  // ==========================================
  
  /**
   * Busca animes por texto. Devuelve los resultados paginados desde Jikan.
   * No guardamos en base de datos aquí para no saturarla de basura.
   */
  async searchAnimes(query: string, page: number = 1): Promise<JikanSearchResponse | null> {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&page=${page}&sfw=true`, {
        next: { revalidate: 3600 }
      })
      if (!response.ok) {
        console.warn(`Jikan API Error (search): ${response.status}`)
        return { data: [] } as unknown as JikanSearchResponse
      }
      
      const data: JikanSearchResponse = await response.json()
      return data
    } catch (error) {
      console.error('Error en searchAnimes:', error)
      return { data: [] } as unknown as JikanSearchResponse
    }
  },

  /**
   * Obtiene los animes más populares (Top Anime).
   */
  async getTopAnimes(page: number = 1): Promise<JikanSearchResponse | null> {
    try {
      // type=tv y filter=bypopularity son filtros comunes en Jikan para simular MAL
      const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}&type=tv&filter=bypopularity`, {
        next: { revalidate: 3600 }
      })
      if (!response.ok) {
        console.warn(`Jikan API Error (top): ${response.status}`)
        return { data: [] } as unknown as JikanSearchResponse
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error en getTopAnimes:', error)
      return { data: [] } as unknown as JikanSearchResponse
    }
  },

  /**
   * Obtiene los animes de la temporada actual.
   */
  async getSeasonalAnimes(page: number = 1): Promise<JikanSearchResponse | null> {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/seasons/now?page=${page}&sfw=true`, {
        next: { revalidate: 3600 }
      })
      if (!response.ok) {
        console.warn(`Jikan API Error (seasonal): ${response.status}`)
        return { data: [] } as unknown as JikanSearchResponse
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error en getSeasonalAnimes:', error)
      return { data: [] } as unknown as JikanSearchResponse
    }
  }
}
