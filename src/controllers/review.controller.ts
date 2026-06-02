'use server'

import { revalidatePath } from 'next/cache'
import { ReviewService } from '@/services/review.service'
import { createClient } from '@/lib/supabase/server'

export async function submitReviewAction(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Debes iniciar sesión para publicar una review' }
    }

    const animeId = formData.get('animeId') as string
    const content = formData.get('content') as string
    const rating = Number(formData.get('rating'))
    const externalId = formData.get('externalId') as string // Para revalidar la URL

    if (!animeId || !content || !rating) {
      return { error: 'Faltan datos obligatorios' }
    }

    await ReviewService.submitReview({
      animeId,
      userId: user.id,
      content,
      rating
    })

    // Revalidamos la página del anime (ej. /anime/1234)
    if (externalId) {
      revalidatePath(`/anime/${externalId}`)
    }

    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Error al guardar la review' }
  }
}

export async function deleteReviewAction(animeId: string, externalId: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'No autorizado' }
    }

    await ReviewService.deleteReview(animeId, user.id)

    revalidatePath(`/anime/${externalId}`)
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Error al eliminar la review' }
  }
}
