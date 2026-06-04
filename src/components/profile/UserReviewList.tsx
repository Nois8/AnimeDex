import Link from 'next/link'
import { Star, MessageSquare } from 'lucide-react'

interface UserReviewListProps {
  reviews: any[]
}

export function UserReviewList({ reviews }: UserReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-[60px] text-[#555] text-[15px]">
        You haven't rated any anime yet.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[24px]">
      {reviews.map((review: any) => {
        const anime = review.animes
        return (
          <div
            key={review.id}
            className="bg-[#1A1A1A] rounded-[10px] p-[24px] border border-[#222]"
          >
            <div className="flex flex-col md:flex-row gap-[20px]">
              {/* Anime cover */}
              <Link href={`/anime/${anime?.external_id}`} className="shrink-0">
                <div className="w-[110px] h-[140px] rounded-[6px] overflow-hidden bg-[#222]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={anime?.cover_image || ''}
                    alt={anime?.title || ''}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>

              {/* Review content */}
              <div className="flex-1 min-w-0">
                {/* Title row */}
                <div className="flex justify-between items-start mb-[4px]">
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#FFFFFF] m-0">
                      {anime?.title || 'Anime'}
                    </h3>
                    <p className="text-[12px] text-[#666] m-0 mt-[4px]">
                      {new Date(review.created_at).toISOString().split('T')[0]}
                    </p>
                  </div>
                  {/* Rating badge */}
                  <div className="flex items-center gap-[4px] bg-[#3D3A20] text-[#FFED70] px-[12px] py-[6px] rounded-[6px] text-[14px] font-semibold shrink-0">
                    <Star className="w-[14px] h-[14px] fill-[#FFED70] text-[#FFED70]" />
                    {review.rating}
                  </div>
                </div>

                {/* Review text */}
                <div className="mt-[16px] bg-[#222] rounded-[8px] p-[16px]">
                  <div className="flex items-center gap-[6px] mb-[8px] text-[12px] text-[#888]">
                    <MessageSquare className="w-[12px] h-[12px]" />
                    Your review
                  </div>
                  <p className="text-[14px] text-[#CCC] leading-[1.6] m-0">
                    {review.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
