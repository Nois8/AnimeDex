'use client'

import { useState, useTransition } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { submitReviewAction } from '@/controllers/review.controller'

export function ReviewForm({ animeId, externalId }: { animeId: string; externalId: string }) {
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
    if (content.trim().length < 10) {
      setError('The review must be at least 10 characters long.')
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append('animeId', animeId)
      formData.append('externalId', externalId)
      formData.append('rating', rating.toString())
      formData.append('content', content)

      const result = await submitReviewAction(formData)
      if (result.error) {
        setError(result.error)
      } else {
        // Reset form on success (though page might reload via revalidatePath)
        setRating(0)
        setContent('')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: '#202020', borderRadius: '8px', padding: '24px', marginBottom: '32px' }}>
      <h3 style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '18px', margin: '0 0 16px 0' }}>Your Review</h3>
      
      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#EF4444', padding: '12px', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              outline: 'none',
              transition: 'transform 0.2s',
              transform: star <= (hoverRating || rating) ? 'scale(1.1)' : 'scale(1)',
            }}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
          >
            <Star 
              style={{
                width: '24px',
                height: '24px',
                transition: 'color 0.2s, fill 0.2s',
                fill: star <= (hoverRating || rating) ? '#FFED70' : 'transparent',
                color: star <= (hoverRating || rating) ? '#FFED70' : '#4B5563',
              }} 
            />
          </button>
        ))}
      </div>

      <textarea
        style={{
          width: '100%',
          backgroundColor: '#101010',
          border: '1px solid #1F2937',
          borderRadius: '4px',
          padding: '16px',
          color: '#FFFFFF',
          outline: 'none',
          minHeight: '120px',
          resize: 'vertical',
          marginBottom: '16px',
          fontSize: '14px',
          fontFamily: 'inherit',
          boxSizing: 'border-box'
        }}
        placeholder="What did you think of this anime? (Minimum 10 characters)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPending}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          type="submit" 
          disabled={isPending}
          style={{
            backgroundColor: '#FFED70',
            color: '#000000',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 700,
            fontSize: '14px',
            padding: '0 32px',
            height: '40px',
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.7 : 1,
            fontFamily: 'inherit'
          }}
        >
          {isPending ? 'Submitting...' : 'Post Review'}
        </button>
      </div>
    </form>
  )
}
