import { createClient } from '@/lib/supabase/server'
import { logoutAction } from '@/controllers/auth.controller'
import { redirect } from 'next/navigation'
import { ReviewService } from '@/services/review.service'
import { ListService } from '@/services/list.service'
import { Settings, Star, Heart, Users, MessageSquare, LogOut } from 'lucide-react'
import Link from 'next/link'
import { AnimeCard } from '@/components/anime/AnimeCard'
import { EditProfileModal } from '@/components/profile/EditProfileModal'

export default async function PerfilPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const resolvedParams = await searchParams;
  const currentTab = resolvedParams.tab || 'puntuados';

  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, avatar_url, bio, created_at')
    .eq('id', user.id)
    .single()

  const reviews = await ReviewService.getUserReviews(user.id)
  const favorites = await ListService.getUserFavorites(user.id)

  // Get follower/following counts
  const { count: followingCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', user.id)

  const { count: followersCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', user.id)

  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'Alex'}`

  const tabs = [
    { id: 'puntuados', icon: <Star style={{ width: '16px', height: '16px', fill: currentTab === 'puntuados' ? 'none' : 'none' }} />, label: 'Rated' },
    { id: 'favoritos', icon: <Heart style={{ width: '16px', height: '16px', fill: currentTab === 'favoritos' ? '#FFED70' : 'none', color: currentTab === 'favoritos' ? '#FFED70' : '#888' }} />, label: 'Favorites' },
    { id: 'siguiendo', icon: <Users style={{ width: '16px', height: '16px' }} />, label: 'Following' },
    { id: 'seguidores', icon: <Users style={{ width: '16px', height: '16px' }} />, label: 'Followers' },
  ]

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#121212', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 56px', width: '100%' }}>

        {/* ==================== PROFILE HEADER ==================== */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Avatar */}
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#1A1A1A',
                flexShrink: 0,
              }}
            >
              <img
                src={avatarUrl}
                alt="Avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Info */}
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 4px 0' }}>
                Alex Rodriguez
              </h1>
              <p style={{ fontSize: '14px', color: '#666', margin: '0 0 12px 0' }}>
                @{profile?.username || 'alexr_anime'}
              </p>
              <p style={{ fontSize: '14px', color: '#999', margin: '0 0 16px 0' }}>
                {profile?.bio || 'Passionate Otaku | Shonen and seinen lover | Watching anime since 2010'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '14px' }}>
                <span>
                  <strong style={{ color: '#FFFFFF' }}>{followingCount || 432}</strong>{' '}
                  <span style={{ color: '#888' }}>Following</span>
                </span>
                <span>
                  <strong style={{ color: '#FFFFFF' }}>{followersCount || 1248}</strong>{' '}
                  <span style={{ color: '#888' }}>Followers</span>
                </span>
                <span>
                  <strong style={{ color: '#FFED70' }}>{reviews.length || 6}</strong>{' '}
                  <span style={{ color: '#888' }}>Rated anime</span>
                </span>
              </div>
            </div>
          </div>

          {/* Edit profile modal */}
          <EditProfileModal initialUsername={profile?.username || ''} initialBio={profile?.bio || ''} />
        </div>

        {/* ==================== TABS ==================== */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            borderBottom: '1px solid #2A2A2A',
            marginBottom: '32px',
            paddingBottom: '0',
          }}
        >
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={`?tab=${tab.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #FFED70' : '2px solid transparent',
                  color: isActive ? '#FFED70' : '#888',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  marginBottom: '-1px',
                }}
              >
                {tab.icon} {tab.label}
              </Link>
            )
          })}
        </div>

        {/* ==================== TAB CONTENT ==================== */}
        
        {currentTab === 'puntuados' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {reviews.length > 0 ? (
              reviews.map((review: any) => {
                const anime = review.animes
                return (
                  <div
                    key={review.id}
                    style={{
                      backgroundColor: '#1A1A1A',
                      borderRadius: '10px',
                      padding: '24px',
                      border: '1px solid #222',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '20px' }}>
                      {/* Anime cover */}
                      <Link href={`/anime/${anime?.external_id}`}>
                        <div
                          style={{
                            width: '110px',
                            height: '140px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            backgroundColor: '#222',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={anime?.cover_image || ''}
                            alt={anime?.title || ''}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      </Link>

                      {/* Review content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Title row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                              {anime?.title || 'Anime'}
                            </h3>
                            <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>
                              {new Date(review.created_at).toISOString().split('T')[0]}
                            </p>
                          </div>
                          {/* Rating badge */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              backgroundColor: '#3D3A20',
                              color: '#FFED70',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            <Star style={{ width: '14px', height: '14px', fill: '#FFED70', color: '#FFED70' }} />
                            {review.rating}
                          </div>
                        </div>

                        {/* Review text */}
                        <div
                          style={{
                            marginTop: '16px',
                            backgroundColor: '#222',
                            borderRadius: '8px',
                            padding: '16px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '12px', color: '#888' }}>
                            <MessageSquare style={{ width: '12px', height: '12px' }} />
                            Your review
                          </div>
                          <p style={{ fontSize: '14px', color: '#CCC', lineHeight: 1.6, margin: 0 }}>
                            {review.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 0',
                  color: '#555',
                  fontSize: '15px',
                }}
              >
                You haven't rated any anime yet.
              </div>
            )}
          </div>
        )}

        {currentTab === 'favoritos' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
            {favorites.length > 0 ? (
              favorites.map((fav: any) => {
                const anime = fav.animes;
                return (
                  <div key={anime.external_id} style={{ position: 'relative' }}>
                    <AnimeCard 
                      id={anime.external_id}
                      title={anime.title}
                      year={new Date().getFullYear()} // Default or fetch real year
                      rating={anime.average_score}
                      imageUrl={anime.cover_image}
                    />
                    {/* Heart Icon Overlay */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'rgba(26,26,26,0.8)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none' // So it doesn't block the link
                      }}
                    >
                      <Heart style={{ width: '16px', height: '16px', fill: '#FFED70', color: '#FFED70' }} />
                    </div>
                  </div>
                )
              })
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: '#555', fontSize: '15px' }}>
                You don't have any favorite anime yet.
              </div>
            )}
          </div>
        )}

        {/* Other tabs can be empty placeholders for now */}
        {(currentTab === 'siguiendo' || currentTab === 'seguidores') && (
           <div style={{ textAlign: 'center', padding: '60px 0', color: '#555', fontSize: '15px' }}>
              No data to show.
           </div>
        )}

      </div>
    </main>
  )
}
