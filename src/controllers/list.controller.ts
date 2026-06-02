'use server'

import { revalidatePath } from 'next/cache'
import { ListService } from '@/services/list.service'
import { createClient } from '@/lib/supabase/server'
import { WatchlistStatus } from '@/types/lists'

export async function toggleFavoriteAction(animeId: string, isCurrentlyFavorite: boolean, externalId: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) return { error: 'Debes iniciar sesión' }

    await ListService.toggleFavorite(animeId, user.id, isCurrentlyFavorite)
    
    revalidatePath(`/anime/${externalId}`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function updateWatchlistAction(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) return { error: 'Debes iniciar sesión' }

    const animeId = formData.get('animeId') as string
    const externalId = formData.get('externalId') as string
    
    // Extraemos campos opcionales del formData
    const statusStr = formData.get('status')
    const status = statusStr ? (statusStr as WatchlistStatus) : undefined
    
    const episodesStr = formData.get('episodesWatched')
    const episodesWatched = episodesStr ? Number(episodesStr) : undefined

    await ListService.updateWatchlist({
      animeId,
      userId: user.id,
      status,
      episodesWatched
    })

    revalidatePath(`/anime/${externalId}`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
