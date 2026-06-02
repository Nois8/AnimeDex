'use client'

import { registerAction } from '@/controllers/auth.controller'
import { Button } from '@/components/ui/Button'
import { Mail, Lock, User } from 'lucide-react'
import Link from 'next/link'
import { useState, useTransition } from 'react'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    setError(null)
    startTransition(async () => {
      const res = await registerAction(formData)
      if (res?.error) {
        setError(res.error)
      }
    })
  }

  return (
    <main className="flex-grow flex items-center justify-center p-4 pt-32 pb-12 md:p-8 md:pt-32 bg-[#101010]">
      <div className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch min-h-[650px]">
        
        {/* Lado Izquierdo: Imagen Atmosférica (Invertido respecto al login) */}
        <div className="hidden md:block relative rounded-[8px] overflow-hidden shadow-lg border border-gray-800/40">
          <img 
            src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1920&auto=format&fit=crop" 
            alt="Anime City Night" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-purple-900/10 mix-blend-overlay" />
        </div>

        {/* Lado Derecho: Formulario */}
        <div className="bg-[#202020] rounded-[8px] p-8 md:p-14 flex flex-col justify-center shadow-lg border border-gray-800/40">
          <div className="w-full max-w-sm mx-auto">
            <div className="flex flex-col mb-10">
              <h1 className="text-[26px] font-bold mb-2 text-white tracking-tight">Join the community</h1>
              <p className="text-[#A3A3A3] text-[15px]">Create your account to save anime, write reviews, and follow your friends.</p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <form action={handleSubmit} className="flex flex-col gap-5">
              <div className="space-y-2">
                <label className="block text-[14px] font-medium text-white" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="text" 
                    name="username" 
                    id="username"
                    placeholder="otaku_pro"
                    className="w-full p-3.5 pl-12 bg-[#101010] text-white rounded-[4px] border border-transparent focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600 text-[15px]" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[14px] font-medium text-white" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="email" 
                    name="email" 
                    id="email"
                    placeholder="youremail@mail.com"
                    className="w-full p-3.5 pl-12 bg-[#101010] text-white rounded-[4px] border border-transparent focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600 text-[15px]" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-[14px] font-medium text-white" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="password" 
                    name="password" 
                    id="password"
                    placeholder="••••••••"
                    className="w-full p-3.5 pl-12 bg-[#101010] text-white rounded-[4px] border border-transparent focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600 tracking-widest text-[15px]" 
                    required 
                    minLength={6}
                  />
                </div>
              </div>

              <Button disabled={isPending} type="submit" size="lg" className="w-full mt-3 font-bold text-black text-[15px] h-12 rounded-[4px] bg-[#FFED70] hover:bg-[#FFED70]/90">
                {isPending ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <p className="mt-8 text-center text-[15px] text-[#A3A3A3]">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
            
            <p className="mt-10 text-center text-[13px] text-gray-500 max-w-xs mx-auto leading-relaxed">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Lado Derecho: Imagen Atmosférica */}
        <div className="hidden md:block relative rounded-[8px] overflow-hidden shadow-lg border border-gray-800/40">
          <img 
            src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1920&auto=format&fit=crop" 
            alt="Anime City Scenery" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
        </div>

      </div>
    </main>
  )
}
