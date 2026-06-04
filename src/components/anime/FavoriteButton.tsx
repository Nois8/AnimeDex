'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toggleFavoriteAction } from '@/controllers/list.controller'
import Link from 'next/link'

export function FavoriteButton({ 
  animeId, 
  initialIsFavorite, 
  externalId,
  isLoggedIn = false
}: { 
  animeId: string; 
  initialIsFavorite: boolean;
  externalId: string;
  isLoggedIn?: boolean;
}) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isPending, startTransition] = useTransition()
  const [isAnimating, setIsAnimating] = useState(false)

  if (!isLoggedIn) {
    return (
      <Link href="/login" style={{ textDecoration: 'none' }}>
        <Button 
          variant="secondary" 
          size="lg" 
          className="h-12 px-[24px] rounded-[4px] bg-[#202020] hover:bg-[#2A2A2A] border-none text-[#FFFFFF] font-bold text-[14px] transition-all duration-300"
        >
          Log in to save
        </Button>
      </Link>
    )
  }

  const handleToggle = async () => {
    const currentState = isFavorite
    // Optimistic UI update
    setIsFavorite(!currentState)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300) // Duration of the pop animation
    
    startTransition(async () => {
      // Pass the state *before* the toggle to let the server know whether to insert or delete
      const result = await toggleFavoriteAction(animeId, currentState, externalId)
      if (result.error) {
        // Revert on error
        setIsFavorite(currentState)
        alert(result.error)
      }
    })
  }

  return (
    <Button 
      variant="secondary" 
      size="lg" 
      className={`w-12 h-12 rounded-[4px] bg-[#202020] hover:bg-[#2A2A2A] border-none p-0 flex items-center justify-center transition-all duration-300 active:scale-90 ${isAnimating ? 'scale-110' : ''}`}
      onClick={handleToggle}
      disabled={isPending}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={`w-[20px] h-[20px] transition-all duration-300 ${
          isFavorite ? 'fill-[#FFED70] text-[#FFED70] drop-shadow-[0_0_8px_rgba(255,237,112,0.5)]' : 'text-gray-400 group-hover:text-gray-300'
        }`} 
      />
    </Button>
  )
}
