import { BookOpen } from "lucide-react";
import { AnimeService, fetchWithRetry } from "@/services/anime.service";
import { ListService } from "@/services/list.service";
import { ReviewService } from "@/services/review.service";
import { createClient } from "@/lib/supabase/server";
import { AnimeHero } from "@/components/anime/AnimeHero";
import { AnimeCharacters } from "@/components/anime/AnimeCharacters";
import { AnimeInfoSidebar } from "@/components/anime/AnimeInfoSidebar";
import { AnimeReviewsSection } from "@/components/anime/AnimeReviewsSection";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const animeId = resolvedParams.id;
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
    const data = await res.json();
    return {
      title: data.data ? `${data.data.title} | AnimeDex` : 'Anime Details | AnimeDex',
      description: data.data?.synopsis || 'View anime details, reviews, and characters on AnimeDex.',
    }
  } catch (error) {
    return { title: 'Anime Details | AnimeDex' }
  }
}

export default async function AnimeDetailsPage({
  params,
}: Props) {
  const resolvedParams = await params;
  const animeId = resolvedParams.id;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let dbAnime;
  try {
    dbAnime = await AnimeService.getAnimeByExternalId(Number(animeId));
  } catch (err: any) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white flex-col gap-4">
        <h2 className="text-2xl text-red-500 font-bold">Internal Error</h2>
        <p className="text-neutral-400">{err.message}</p>
      </div>
    );
  }

  if (!dbAnime) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        Anime not found.
      </div>
    );
  }

  const isFavorite = user
    ? await ListService.isFavorite(dbAnime.id, user.id)
    : false;
  const watchlistEntry = user
    ? await ListService.getWatchlistEntry(dbAnime.id, user.id)
    : null;
  const reviews = await ReviewService.getAnimeReviews(dbAnime.id);

  const [jikanRes, charsRes] = await Promise.all([
    fetchWithRetry(`https://api.jikan.moe/v4/anime/${animeId}/full`),
    fetchWithRetry(`https://api.jikan.moe/v4/anime/${animeId}/characters`),
  ]);

  if (!jikanRes.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        Anime not found in Jikan API
      </div>
    );
  }

  const jikanData = await jikanRes.json();
  const charsData = charsRes.ok ? await charsRes.json() : { data: [] };
  const fullAnime = jikanData.data;
  const characters = (charsData.data || [])
    .filter((c: any) => c.character?.images?.webp?.image_url)
    .slice(0, 6);

  return (
    <main className="min-h-[100vh] bg-[#121212] pt-[80px] pb-[80px]">
      <div className="max-w-[1000px] mx-auto px-[56px] w-full">
        <AnimeHero
          fullAnime={fullAnime}
          dbAnime={dbAnime}
          isFavorite={isFavorite}
          watchlistEntry={watchlistEntry}
          animeId={animeId}
          user={user}
        />

        {/* 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-[1fr_300px] gap-[24px] mb-[56px]">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-[24px]">
            {/* Synopsis */}
            <div className="bg-[#1A1A1A] rounded-[10px] p-[28px]">
              <h2 className="text-[18px] font-bold text-[#FFF] flex items-center gap-[8px] m-0 mb-[16px]">
                <BookOpen className="w-[18px] h-[18px] text-[#FFED70]" /> Synopsis
              </h2>
              <p className="text-[14px] text-[#BBB] leading-[1.7] m-0 whitespace-pre-line">
                {fullAnime.synopsis || "No synopsis available."}
              </p>
            </div>

            <AnimeCharacters characters={characters} />
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <AnimeInfoSidebar fullAnime={fullAnime} dbAnime={dbAnime} />
          </div>
        </div>

        <AnimeReviewsSection
          reviews={reviews}
          dbAnime={dbAnime}
          animeId={animeId}
          user={user}
        />
      </div>
    </main>
  );
}
