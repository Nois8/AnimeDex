import { Play, BookOpen, Users, Info, Calendar, Clock, Tv, Star, ShieldAlert, MonitorPlay, Heart } from 'lucide-react'
import Link from 'next/link'
import { AnimeService } from '@/services/anime.service'
import { ListService } from '@/services/list.service'
import { ReviewService } from '@/services/review.service'
import { createClient } from '@/lib/supabase/server'
import { FavoriteButton } from '@/components/anime/FavoriteButton'
import { WatchlistSelect } from '@/components/anime/WatchlistSelect'
import { ReviewForm } from '@/components/anime/ReviewForm'

export default async function AnimeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  const animeId = resolvedParams.id;

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let dbAnime;
  try {
    dbAnime = await AnimeService.getAnimeByExternalId(Number(animeId));
  } catch (err: any) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', backgroundColor: '#121212', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '24px', color: '#EF4444', fontWeight: 700 }}>Internal Error</h2>
        <p style={{ color: '#888' }}>{err.message}</p>
      </div>
    );
  }

  if (!dbAnime) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', backgroundColor: '#121212' }}>Anime not found.</div>;
  }

  const isFavorite = user ? await ListService.isFavorite(dbAnime.id, user.id) : false;
  const watchlistEntry = user ? await ListService.getWatchlistEntry(dbAnime.id, user.id) : null;
  const reviews = await ReviewService.getAnimeReviews(dbAnime.id);

  const [jikanRes, charsRes] = await Promise.all([
    fetch(`https://api.jikan.moe/v4/anime/${animeId}/full`),
    fetch(`https://api.jikan.moe/v4/anime/${animeId}/characters`)
  ]);

  if (!jikanRes.ok) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', backgroundColor: '#121212' }}>Anime not found in Jikan API</div>;
  }

  const jikanData = await jikanRes.json();
  const charsData = charsRes.ok ? await charsRes.json() : { data: [] };
  const fullAnime = jikanData.data;
  const characters = (charsData.data || [])
    .filter((c: any) => c.character?.images?.webp?.image_url)
    .slice(0, 6);

  // Helper for info rows
  const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#666' }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: '14px', fontWeight: 500, color: '#FFF', paddingLeft: '24px' }}>{value}</div>
    </div>
  );

  const statusText = fullAnime.status === 'Finished Airing' ? 'Finished' : fullAnime.status === 'Currently Airing' ? 'Airing' : fullAnime.status;
  const isFinished = fullAnime.status === 'Finished Airing';

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#121212', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 56px', width: '100%' }}>

        {/* ==================== HERO HEADER ==================== */}
        <div style={{ display: 'flex', gap: '28px', marginBottom: '40px' }}>
          {/* Poster */}
          <div
            style={{
              width: '200px',
              height: '200px',
              flexShrink: 0,
              borderRadius: '10px',
              overflow: 'hidden',
              backgroundColor: '#1A1A1A',
            }}
          >
            <img
              src={fullAnime.images?.webp?.large_image_url || ''}
              alt={fullAnime.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 14px 0', lineHeight: 1.2 }}>
              {fullAnime.title}
            </h1>

            {/* Primary badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ padding: '4px 12px', backgroundColor: '#222', color: '#CCC', borderRadius: '9999px', fontSize: '12px', fontWeight: 500 }}>
                {fullAnime.year || 'N/A'}
              </span>
              <span style={{ padding: '4px 12px', backgroundColor: '#222', color: '#CCC', borderRadius: '9999px', fontSize: '12px', fontWeight: 500 }}>
                {fullAnime.studios?.[0]?.name || 'Studio'}
              </span>
              <span style={{ padding: '4px 12px', backgroundColor: '#222', color: '#CCC', borderRadius: '9999px', fontSize: '12px', fontWeight: 500 }}>
                {fullAnime.episodes ? `${fullAnime.episodes} Episodes` : 'Airing'}
              </span>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 500,
                  border: '1px solid',
                  backgroundColor: isFinished ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)',
                  color: isFinished ? '#22C55E' : '#3B82F6',
                  borderColor: isFinished ? 'rgba(34,197,94,0.3)' : 'rgba(59,130,246,0.3)',
                }}
              >
                {statusText}
              </span>
            </div>

            {/* Genre badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
              {fullAnime.genres?.map((g: any) => (
                <span key={g.mal_id} style={{ padding: '5px 14px', backgroundColor: '#1E1E1E', color: '#999', borderRadius: '9999px', fontSize: '12px', fontWeight: 500 }}>
                  {g.name}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#FFED70',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '14px',
                  padding: '0 24px',
                  height: '42px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <Play style={{ width: '16px', height: '16px', fill: 'currentColor' }} /> Watch Now
              </button>
              <FavoriteButton
                animeId={dbAnime.id}
                initialIsFavorite={isFavorite}
                externalId={animeId}
              />
            </div>
          </div>
        </div>

        {/* ==================== 2-COLUMN LAYOUT ==================== */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', marginBottom: '56px' }}>

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Sinopsis */}
            <div style={{ backgroundColor: '#1A1A1A', borderRadius: '10px', padding: '28px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0' }}>
                <BookOpen style={{ width: '18px', height: '18px', color: '#FFED70' }} /> Synopsis
              </h2>
              <p style={{ fontSize: '14px', color: '#BBB', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
                {fullAnime.synopsis || 'No synopsis available.'}
              </p>
            </div>

            {/* Personajes Clave */}
            <div style={{ backgroundColor: '#1A1A1A', borderRadius: '10px', padding: '28px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 20px 0' }}>
                <Users style={{ width: '18px', height: '18px', color: '#FFED70' }} /> Key Characters
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {characters.map((char: any) => (
                  <div key={char.character.mal_id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div
                      style={{
                        width: '100%',
                        paddingBottom: '133%',
                        position: 'relative',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        backgroundColor: '#222',
                      }}
                    >
                      <img
                        src={char.character.images.webp.image_url}
                        alt={char.character.name}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: '#FFED70', margin: '0 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {char.character.name}
                      </p>
                      <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>
                        {char.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Info General */}
          <div>
            <div style={{ backgroundColor: '#1A1A1A', borderRadius: '10px', padding: '28px', position: 'sticky', top: '100px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 24px 0' }}>
                <Info style={{ width: '18px', height: '18px', color: '#FFED70' }} /> General Information
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <InfoRow icon={<Tv style={{ width: '14px', height: '14px' }} />} label="Type" value={fullAnime.type || 'Unknown'} />
                <InfoRow icon={<MonitorPlay style={{ width: '14px', height: '14px' }} />} label="Episodes" value={String(fullAnime.episodes || '?')} />
                <InfoRow icon={<Clock style={{ width: '14px', height: '14px' }} />} label="Duration" value={fullAnime.duration || 'Unknown'} />
                <InfoRow icon={<Calendar style={{ width: '14px', height: '14px' }} />} label="Premiered" value={fullAnime.season && fullAnime.year ? `${fullAnime.season} ${fullAnime.year}` : 'Unknown'} />
                <InfoRow icon={<Info style={{ width: '14px', height: '14px' }} />} label="Status" value={statusText} />
                <InfoRow icon={<BookOpen style={{ width: '14px', height: '14px' }} />} label="Source" value={fullAnime.source || 'Unknown'} />
                <InfoRow icon={<Users style={{ width: '14px', height: '14px' }} />} label="Studio" value={fullAnime.studios?.[0]?.name || 'Unknown'} />
                <InfoRow icon={<ShieldAlert style={{ width: '14px', height: '14px' }} />} label="Rating" value={fullAnime.rating || 'Unknown'} />

                {/* Score */}
                <div style={{ marginTop: '8px', paddingTop: '18px', borderTop: '1px solid #2A2A2A' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                    <Star style={{ width: '14px', height: '14px' }} /> Score
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '24px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#3D3A20',
                        padding: '6px 12px',
                        borderRadius: '6px',
                      }}
                    >
                      <Star style={{ width: '16px', height: '16px', fill: '#FFED70', color: '#FFED70' }} />
                      <span style={{ color: '#FFF', fontWeight: 700, fontSize: '16px' }}>{dbAnime?.average_score || 0}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#666' }}>based on {dbAnime?.total_reviews || 0} reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== RESEÑAS ==================== */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>Reviews</h2>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#3D3A20',
                  padding: '4px 10px',
                  borderRadius: '4px',
                }}
              >
                <Star style={{ width: '14px', height: '14px', fill: '#FFED70', color: '#FFED70' }} />
                <span style={{ color: '#FFF', fontWeight: 700, fontSize: '13px' }}>
                  {dbAnime?.average_score || 0}{' '}
                  <span style={{ color: '#888', fontWeight: 400 }}>({dbAnime?.total_reviews || 0})</span>
                </span>
              </div>
            </div>

            {user && (
              <ReviewForm animeId={dbAnime.id} externalId={animeId} />
            )}
          </div>

          {/* Review list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviews.length === 0 ? (
              <div style={{ color: '#666', textAlign: 'center', padding: '48px 0', backgroundColor: '#1A1A1A', borderRadius: '10px', fontSize: '14px' }}>
                No reviews yet. {user ? 'Be the first to write one!' : 'Log in to write a review.'}
              </div>
            ) : (
              reviews.map((review: any) => (
                <div key={review.id} style={{ backgroundColor: '#1A1A1A', borderRadius: '10px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      {/* Avatar */}
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#222', flexShrink: 0 }}>
                        <img
                          src={review.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.profiles?.username}`}
                          alt="Avatar"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#FFF', margin: '0 0 4px 0' }}>
                          {review.profiles?.username || 'User'}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map((s: number) => (
                            <Star
                              key={s}
                              style={{
                                width: '12px',
                                height: '12px',
                                fill: s <= review.rating ? '#FFED70' : '#333',
                                color: s <= review.rating ? '#FFED70' : '#333',
                              }}
                            />
                          ))}
                          <span style={{ fontSize: '11px', color: '#666', marginLeft: '6px' }}>{review.rating}/5</span>
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: '#555' }}>
                      {new Date(review.created_at).toISOString().split('T')[0]}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#BBB', lineHeight: 1.6, margin: 0, paddingLeft: '58px' }}>
                    {review.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  )
}
