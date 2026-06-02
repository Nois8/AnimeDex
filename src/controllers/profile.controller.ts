'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ProfileService } from '@/services/profile.service'

export async function updateProfileAction(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Debes iniciar sesión para editar tu perfil.' }
    }

    const username = formData.get('username') as string
    const bio = formData.get('bio') as string

    if (!username || username.trim().length < 3) {
      return { error: 'El nombre de usuario debe tener al menos 3 caracteres.' }
    }

    // Attempt to update the profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        username: username.trim(),
        bio: bio ? bio.trim() : null,
      })
      .eq('id', user.id)

    if (updateError) {
      if (updateError.code === '23505') { // Unique violation
        return { error: 'Este nombre de usuario ya está en uso.' }
      }
      return { error: updateError.message }
    }

    revalidatePath('/') // Navbar
    revalidatePath('/perfil')

    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Error inesperado al actualizar el perfil.' }
  }
}

export async function toggleFollowAction(followingId: string, isCurrentlyFollowing: boolean, username: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) return { error: 'Debes iniciar sesión' }

    if (isCurrentlyFollowing) {
      await ProfileService.unfollow(user.id, followingId)
    } else {
      await ProfileService.follow(user.id, followingId)
    }
    
    revalidatePath(`/${username}`)
    revalidatePath('/perfil')
    return { success: true }
  } catch (error: any) {
    return { error: error.message }
  }
}
