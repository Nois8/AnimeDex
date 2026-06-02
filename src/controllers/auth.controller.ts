'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { AuthService } from '@/services/auth.service'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email y contraseña son obligatorios' }
  }

  try {
    await AuthService.login({ email, password })
  } catch (error: any) {
    return { error: error.message || 'Error al iniciar sesión' }
  }

  revalidatePath('/')
  redirect('/perfil')
}

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  if (!email || !password || !username) {
    return { error: 'Todos los campos son obligatorios' }
  }

  try {
    await AuthService.register({ email, password }, username)
  } catch (error: any) {
    return { error: error.message || 'Error al registrar el usuario' }
  }

  redirect('/login?registered=true')
}

export async function logoutAction() {
  try {
    await AuthService.logout()
  } catch (error) {
    console.error('Error en logout:', error)
  }
  redirect('/login')
}
