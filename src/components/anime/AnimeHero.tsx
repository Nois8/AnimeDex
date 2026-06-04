import { FavoriteButton } from "@/components/anime/FavoriteButton";
import { WatchlistSelect } from "@/components/anime/WatchlistSelect";

import { JikanAnime, DatabaseAnime } from "@/types/anime";

interface AnimeHeroProps {
  fullAnime: JikanAnime;
  dbAnime: DatabaseAnime;
  isFavorite: boolean;
  watchlistEntry: any;
  animeId: string;
  user: any;
}

export function AnimeHero({ fullAnime, dbAnime, isFavorite, watchlistEntry, animeId, user }: AnimeHeroProps) {
  const statusText =
    fullAnime.status === "Finished Airing"
      ? "Finished"
      : fullAnime.status === "Currently Airing"
      ? "Airing"
      : fullAnime.status;
  const isFinished = fullAnime.status === "Finished Airing";

  return (
    <div className="flex gap-[28px] mb-[40px]">
      {/* Poster */}
      <div className="w-[200px] h-[200px] shrink-0 rounded-[10px] overflow-hidden bg-[#1A1A1A]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fullAnime.images?.webp?.large_image_url || ""}
          alt={fullAnime.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col justify-center">
        <h1 className="text-[28px] font-bold text-[#FFFFFF] m-0 mb-[14px] leading-[1.2]">
          {fullAnime.title}
        </h1>

        {/* Primary badges */}
        <div className="flex flex-wrap items-center gap-[8px] mb-[12px]">
          <span className="px-[12px] py-[4px] bg-[#222] text-[#CCC] rounded-full text-[12px] font-medium">
            {fullAnime.year || "N/A"}
          </span>
          <span className="px-[12px] py-[4px] bg-[#222] text-[#CCC] rounded-full text-[12px] font-medium">
            {fullAnime.studios?.[0]?.name || "Studio"}
          </span>
          <span className="px-[12px] py-[4px] bg-[#222] text-[#CCC] rounded-full text-[12px] font-medium">
            {fullAnime.episodes ? `${fullAnime.episodes} Episodes` : "Airing"}
          </span>
          <span
            className={`px-[12px] py-[4px] rounded-full text-[12px] font-medium border ${
              isFinished
                ? "bg-[rgba(34,197,94,0.1)] text-[#22C55E] border-[rgba(34,197,94,0.3)]"
                : "bg-[rgba(59,130,246,0.1)] text-[#3B82F6] border-[rgba(59,130,246,0.3)]"
            }`}
          >
            {statusText}
          </span>
        </div>

        {/* Genre badges */}
        <div className="flex flex-wrap gap-[8px] mb-[20px]">
          {fullAnime.genres?.map((g: any) => (
            <span
              key={g.mal_id}
              className="px-[14px] py-[5px] bg-[#1E1E1E] text-[#999] rounded-full text-[12px] font-medium"
            >
              {g.name}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-[12px]">
          <FavoriteButton
            animeId={dbAnime.id}
            initialIsFavorite={isFavorite}
            externalId={animeId}
            isLoggedIn={!!user}
          />
          <WatchlistSelect
            animeId={dbAnime.id}
            initialStatus={watchlistEntry?.status}
            externalId={animeId}
            isLoggedIn={!!user}
          />
        </div>
      </div>
    </div>
  );
}
