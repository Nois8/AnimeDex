import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ReviewService } from '@/services/review.service'
import { ListService } from '@/services/list.service'

import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { UserReviewList } from '@/components/profile/UserReviewList'
import { FavoriteAnimeGrid } from '@/components/profile/FavoriteAnimeGrid'
import { WatchlistGrid } from '@/components/profile/WatchlistGrid'
import { UserListGrid } from '@/components/profile/UserListGrid'
import { ProfileService } from '@/services/profile.service'

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

  const [reviews, favorites, watchlist, { count: followingCount }, { count: followersCount }] = await Promise.all([
    ReviewService.getUserReviews(user.id),
    ListService.getUserFavorites(user.id),
    ListService.getUserWatchlist(user.id),
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', user.id),
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', user.id)
  ])

  // Get follower/following lists if needed
  let followersList: any[] = []
  let followingList: any[] = []
  let followStatuses: Record<string, boolean> = {}

  if (currentTab === 'seguidores' || currentTab === 'siguiendo') {
    if (currentTab === 'seguidores') {
      followersList = await ProfileService.getFollowers(user.id)
    } else {
      followingList = await ProfileService.getFollowing(user.id)
    }

    const targetList = currentTab === 'seguidores' ? followersList : followingList

    // Fetch follow statuses for these users en lote (Evita N+1 queries)
    if (targetList.length > 0) {
      const targetIds = targetList.map((u: any) => u.id)
      followStatuses = await ProfileService.getFollowingStatusesBatch(user.id, targetIds)
    }
  }

  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'Alex'}`

  return (
    <main className="min-h-screen bg-[#121212] pt-[80px] pb-[80px]">
      <div className="max-w-[1000px] mx-auto px-[32px] md:px-[56px] w-full">

        <ProfileHeader 
          profile={profile}
          followingCount={followingCount || 0}
          followersCount={followersCount || 0}
          reviewsCount={reviews.length}
          avatarUrl={avatarUrl}
        />

        <ProfileTabs currentTab={currentTab} />
        
        {/* ==================== TAB CONTENT ==================== */}
        
        {currentTab === 'puntuados' && (
          <UserReviewList reviews={reviews} />
        )}

        {currentTab === 'favoritos' && (
          <FavoriteAnimeGrid favorites={favorites} />
        )}

        {currentTab === 'milista' && (
          <WatchlistGrid watchlist={watchlist} />
        )}

        {currentTab === 'siguiendo' && (
          <UserListGrid 
            users={followingList} 
            currentUserId={user.id} 
            followStatuses={followStatuses} 
            emptyMessage="You are not following anyone yet."
          />
        )}

        {currentTab === 'seguidores' && (
          <UserListGrid 
            users={followersList} 
            currentUserId={user.id} 
            followStatuses={followStatuses} 
            emptyMessage="You don't have any followers yet."
          />
        )}

      </div>
    </main>
  )
}
