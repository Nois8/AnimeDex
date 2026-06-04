import { Heart } from 'lucide-react'
import { AnimeCard } from '@/components/anime/AnimeCard'

interface FavoriteAnimeGridProps {
  favorites: any[]
}

export function FavoriteAnimeGrid({ favorites }: FavoriteAnimeGridProps) {
  if (favorites.length === 0) {
    return (
      <div className="col-span-full text-center py-[60px] text-[#555] text-[15px]">
        You don't have any favorite anime yet.
      </div>
    )
  }

  return (
    <div className="favorites-grid">
      {favorites.map((fav: any) => {
        const anime = fav.animes;
        return (
          <div key={anime.external_id} className="relative">
            <AnimeCard 
              id={anime.external_id}
              title={anime.title}
              year={new Date().getFullYear()} // Default or fetch real year
              rating={anime.average_score ?? 0}
              imageUrl={anime.cover_image}
            />
            {/* Heart Icon Overlay */}
            <div className="absolute top-[8px] right-[8px] w-[32px] h-[32px] bg-[rgba(26,26,26,0.8)] rounded-full flex items-center justify-center pointer-events-none">
              <Heart className="w-[16px] h-[16px] fill-[#FFED70] text-[#FFED70]" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
