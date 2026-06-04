'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export function UserSearchInput({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      if (query.trim()) {
        router.push(`/usuarios?q=${encodeURIComponent(query.trim())}`)
      } else {
        router.push('/usuarios')
      }
    })
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-[600px] mx-auto mb-[40px]">
      <input
        type="text"
        placeholder="Search users by username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-[52px] bg-[#1A1A1A] border border-[#333] rounded-[8px] pl-[48px] pr-[16px] text-[#FFF] text-[15px] focus:outline-none focus:border-[#FFED70] transition-colors"
      />
      <Search className="absolute left-[16px] top-[14px] w-[20px] h-[20px] text-[#666]" />
      <button 
        type="submit" 
        disabled={isPending}
        className="absolute right-[8px] top-[8px] h-[36px] px-[16px] bg-[#FFED70] text-[#000] font-bold text-[13px] rounded-[4px] disabled:opacity-50"
      >
        Search
      </button>
    </form>
  )
}
