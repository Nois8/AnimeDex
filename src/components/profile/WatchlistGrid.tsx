'use client'

import { useState } from 'react'
import { AnimeCard } from '@/components/anime/AnimeCard'

interface WatchlistGridProps {
  watchlist: any[]
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'watching', label: 'Watching' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'dropped', label: 'Dropped' },
  { value: 'plan_to_watch', label: 'Plan to Watch' }
]

export function WatchlistGrid({ watchlist }: WatchlistGridProps) {
  const [filter, setFilter] = useState('all')

  const filteredList = filter === 'all' 
    ? watchlist 
    : watchlist.filter(entry => entry.status === filter)

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-[60px] text-[#555] text-[15px]">
        Your watchlist is empty.
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-[8px] mb-[24px] overflow-x-auto hide-scrollbar pb-[8px]">
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-[16px] py-[6px] rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors border ${
              filter === opt.value
                ? 'bg-[#FFED70] text-[#000] border-[#FFED70]'
                : 'bg-[#1A1A1A] text-[#888] border-[#333] hover:border-[#666] hover:text-[#CCC]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filteredList.length === 0 ? (
        <div className="text-center py-[60px] text-[#555] text-[15px]">
          No anime in this category.
        </div>
      ) : (
        <div className="favorites-grid">
          {filteredList.map((entry: any) => {
            const anime = entry.animes;
            return (
              <div key={anime.external_id} className="relative">
                <AnimeCard 
                  id={anime.external_id}
                  title={anime.title}
                  year={new Date().getFullYear()} // Default or fetch real year
                  rating={anime.average_score ?? 0}
                  imageUrl={anime.cover_image}
                />
                
                {/* Status Overlay */}
                <div className="absolute top-[8px] right-[8px] px-[8px] py-[4px] bg-[rgba(26,26,26,0.9)] rounded-[4px] text-[#FFF] text-[11px] font-bold pointer-events-none">
                  {entry.status === 'watching' && 'Watching'}
                  {entry.status === 'completed' && 'Completed'}
                  {entry.status === 'on_hold' && 'On Hold'}
                  {entry.status === 'dropped' && 'Dropped'}
                  {entry.status === 'plan_to_watch' && 'Plan to Watch'}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
