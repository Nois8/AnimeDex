'use client'

import { registerAction } from '@/controllers/auth.controller'
import { Button } from '@/components/ui/Button'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { useState, useTransition } from 'react'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    setError(null)
    const password = formData.get('password') as string
    const confirm = formData.get('confirm_password') as string
    
    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }

    startTransition(async () => {
      const res = await registerAction(formData)
      if (res?.error) {
        setError(res.error)
      }
    })
  }

  return (
    <main className="flex-grow flex items-center justify-center p-4 pt-28 pb-12 bg-[#121212]">
      <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch min-h-[700px]">
        
        {/* Left Side: Form */}
        <div className="bg-[#1C1C1E] rounded-[12px] p-8 md:p-12 flex flex-col justify-center">
          <div className="w-full max-w-[340px] mx-auto">
            
            {/* Logo and Header */}
            <div className="flex flex-col items-center mb-8 text-center">
              <div className="w-14 h-14 bg-[#FFED70] rounded-full flex items-center justify-center mb-5">
                <span className="text-black text-[28px] font-bold leading-none mt-[-2px]">a</span>
              </div>
              <h1 className="text-[22px] font-bold mb-2 text-white">Join AnimeDex</h1>
              <p className="text-[#A3A3A3] text-[14px]">Create your account and discover the best anime</p>
            </div>
            
            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <form action={handleSubmit} className="flex flex-col gap-4">
              {/* Using Search icon to perfectly match the provided mockup's placeholder icons */}
              <div className="space-y-1.5">
                <label className="block text-[13px] text-[#D1D1D1]" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#666]" />
                  <input 
                    type="text" 
                    name="username" 
                    id="username"
                    placeholder="otaku_pro"
                    className="w-full p-3 pl-11 bg-[#121212] text-white rounded-md border border-transparent focus:border-[#FFED70]/50 outline-none transition-all placeholder:text-[#555] text-[14px]" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] text-[#D1D1D1]" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#666]" />
                  <input 
                    type="email" 
                    name="email" 
                    id="email"
                    placeholder="youremail@mail.com"
                    className="w-full p-3 pl-11 bg-[#121212] text-white rounded-md border border-transparent focus:border-[#FFED70]/50 outline-none transition-all placeholder:text-[#555] text-[14px]" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-[13px] text-[#D1D1D1]" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#666]" />
                  <input 
                    type="password" 
                    name="password" 
                    id="password"
                    placeholder="••••••••"
                    className="w-full p-3 pl-11 bg-[#121212] text-white rounded-md border border-transparent focus:border-[#FFED70]/50 outline-none transition-all placeholder:text-[#555] tracking-widest text-[14px]" 
                    required 
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[13px] text-[#D1D1D1]" htmlFor="confirm_password">
                  Confirm password
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#666]" />
                  <input 
                    type="password" 
                    name="confirm_password" 
                    id="confirm_password"
                    placeholder="••••••••"
                    className="w-full p-3 pl-11 bg-[#121212] text-white rounded-md border border-transparent focus:border-[#FFED70]/50 outline-none transition-all placeholder:text-[#555] tracking-widest text-[14px]" 
                    required 
                    minLength={6}
                  />
                </div>
              </div>

              <Button disabled={isPending} type="submit" className="w-full mt-2 font-medium text-black text-[14px] h-[46px] rounded-md bg-[#FFED70] hover:bg-[#FFED70]/90 transition-colors">
                {isPending ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <p className="mt-6 text-center text-[13px] text-[#A3A3A3]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#FFED70] hover:underline">
                Sign in
              </Link>
            </p>
            
            <p className="mt-8 text-center text-[11px] text-[#666] leading-relaxed">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Right Side: Atmospheric Image (Blue Sky with Birds) */}
        <div className="hidden md:block relative rounded-[12px] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1510006764426-17b5f939eecb?q=80&w=1920&auto=format&fit=crop" 
            alt="Blue Sky with Birds" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-cyan-900/10 mix-blend-overlay" />
        </div>

      </div>
    </main>
  )
}
