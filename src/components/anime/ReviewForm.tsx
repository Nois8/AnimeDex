'use client'

import { useState, useTransition } from 'react'
import { Star } from 'lucide-react'
import { submitReviewAction } from '@/controllers/review.controller'

export function ReviewForm({ 
  animeId, 
  externalId,
  user,
  onOptimisticAdd
}: { 
  animeId: string; 
  externalId: string;
  user: any;
  onOptimisticAdd?: (review: any) => void
}) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (rating === 0) {
      setError('Please select a rating.')
      return
    }

    const currentRating = rating
    const currentContent = content

    // Limpiar formulario mientras se sube
    setRating(0)
    setContent('')

    startTransition(async () => {
      // Añadir review de forma optimista
      if (onOptimisticAdd) {
        onOptimisticAdd({
          id: `optimistic-${Date.now()}`,
          rating: currentRating,
          content: currentContent,
          created_at: new Date().toISOString(),
          profiles: {
            username: user?.user_metadata?.name || 'You',
            avatar_url: user?.user_metadata?.avatar_url || ''
          },
          isOptimistic: true
        })
      }

      const formData = new FormData()
      formData.append('animeId', animeId)
      formData.append('externalId', externalId)
      formData.append('rating', currentRating.toString())
      formData.append('content', currentContent)

      const result = await submitReviewAction(formData)
      if (result.error) {
        // En caso de error, podríamos restaurar, pero el server state se revalidará
        setError(result.error)
        setRating(currentRating)
        setContent(currentContent)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#202020] rounded-[8px] p-[24px] mb-[32px]">
      <h3 className="text-[#FFFFFF] font-bold text-[18px] m-0 mb-[16px]">Your Review</h3>
      
      {error && (
        <div className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.5)] text-[#EF4444] p-[12px] rounded-[4px] mb-[16px] text-[14px]">
          {error}
        </div>
      )}

      <div className="flex items-center gap-[8px] mb-[16px]">
        {[1, 2, 3, 4, 5].map((star: number) => (
          <button
            key={star}
            type="button"
            className="bg-transparent border-none p-0 cursor-pointer outline-none transition-transform duration-200"
            style={{
              transform: star <= (hoverRating || rating) ? 'scale(1.1)' : 'scale(1)',
            }}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
          >
            <Star 
              className="w-[24px] h-[24px] transition-colors duration-200"
              style={{
                fill: star <= (hoverRating || rating) ? '#FFED70' : 'transparent',
                color: star <= (hoverRating || rating) ? '#FFED70' : '#4B5563',
              }} 
            />
          </button>
        ))}
      </div>

      <textarea
        className="w-full bg-[#101010] border border-[#1F2937] rounded-[4px] p-[16px] text-[#FFFFFF] outline-none min-h-[120px] resize-y mb-[16px] text-[14px] font-inherit box-border"
        placeholder="What did you think of this anime? (Optional)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPending}
      />

      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-[#FFED70] text-[#000000] border-none rounded-[4px] font-bold text-[14px] px-[32px] h-[40px] font-inherit transition-opacity"
          style={{
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {isPending ? 'Submitting...' : 'Post Review'}
        </button>
      </div>
    </form>
  )
}
