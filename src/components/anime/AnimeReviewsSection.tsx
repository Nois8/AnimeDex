'use client'

import { useOptimistic } from "react";
import { Star } from "lucide-react";
import { ReviewForm } from "@/components/anime/ReviewForm";

interface AnimeReviewsSectionProps {
  reviews: any[];
  dbAnime: any;
  animeId: string;
  user: any;
}

export function AnimeReviewsSection({ reviews, dbAnime, animeId, user }: AnimeReviewsSectionProps) {
  const [optimisticReviews, addOptimisticReview] = useOptimistic(
    reviews,
    (state, newReview: any) => [newReview, ...state]
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-[24px]">
        <div className="flex items-center gap-[12px]">
          <h2 className="text-[22px] font-bold text-[#FFFFFF] m-0">Reviews</h2>
          <div className="flex items-center gap-[6px] bg-[#3D3A20] px-[10px] py-[4px] rounded-[4px]">
            <Star className="w-[14px] h-[14px] fill-[#FFED70] text-[#FFED70]" />
            <span className="text-[#FFF] font-bold text-[13px]">
              {dbAnime?.average_score || 0}{" "}
              <span className="text-[#888] font-normal">
                ({dbAnime?.total_reviews || 0})
              </span>
            </span>
          </div>
        </div>

        {user && <ReviewForm animeId={dbAnime.id} externalId={animeId} user={user} onOptimisticAdd={addOptimisticReview} />}
      </div>

      {/* Review list */}
      <div className="flex flex-col gap-[16px]">
        {optimisticReviews.length === 0 ? (
          <div className="text-[#666] text-center py-[48px] bg-[#1A1A1A] rounded-[10px] text-[14px]">
            No reviews yet. {user ? "Be the first to write one!" : "Log in to write a review."}
          </div>
        ) : (
          optimisticReviews.map((review: any) => (
            <div key={review.id} className={`bg-[#1A1A1A] rounded-[10px] p-[24px] ${review.isOptimistic ? 'opacity-50' : ''}`}>
              <div className="flex justify-between items-start mb-[16px]">
                <div className="flex gap-[14px] items-center">
                  {/* Avatar */}
                  <div className="w-[44px] h-[44px] rounded-full overflow-hidden bg-[#222] shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        review.profiles?.avatar_url ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.profiles?.username}`
                      }
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#FFF] m-0 mb-[4px]">
                      {review.profiles?.username || "User"}
                    </h4>
                    <div className="flex items-center gap-[2px]">
                      {[1, 2, 3, 4, 5].map((s: number) => (
                        <Star
                          key={s}
                          className={`w-[12px] h-[12px] ${
                            s <= review.rating
                              ? "fill-[#FFED70] text-[#FFED70]"
                              : "fill-[#333] text-[#333]"
                          }`}
                        />
                      ))}
                      <span className="text-[11px] text-[#666] ml-[6px]">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-[12px] text-[#555]">
                  {new Date(review.created_at).toISOString().split("T")[0]}
                </span>
              </div>
              <p className="text-[14px] text-[#BBB] leading-[1.6] m-0 pl-[58px]">
                {review.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
