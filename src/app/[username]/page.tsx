import { Button } from '@/components/ui/Button'
import { Settings, Star, Heart, Users, User, MessageSquare } from 'lucide-react'
import { ProfileService } from '@/services/profile.service'
import { ReviewService } from '@/services/review.service'
import { createClient } from '@/lib/supabase/server'
import { FollowButton } from '@/components/profile/FollowButton'
import Link from 'next/link'

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const resolvedParams = await params;
  const username = resolvedParams.username
  
  // 1. Fetch Profile
  const profile = await ProfileService.getProfileByUsername(username);

  if (!profile) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white bg-[#101010]">
        Perfil no encontrado
      </main>
    )
  }

  // 2. Fetch User and Follow status
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const isOwnProfile = user?.id === profile.id;
  const isFollowing = user && !isOwnProfile 
    ? await ProfileService.isFollowing(user.id, profile.id)
    : false;

  // 3. Fetch Reviews
  const reviews = await ReviewService.getUserReviews(profile.id);

  return (
    <main className="min-h-screen bg-[#101010] pt-32 pb-16">
      <div className="max-w-5xl mx-auto px-8">
        
        {/* User Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-[#202020] overflow-hidden flex-shrink-0">
              <img 
                src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="text-center md:text-left flex flex-col items-center md:items-start gap-3">
              <div>
                <h1 className="text-[28px] font-bold text-white tracking-tight">{profile.username}</h1>
                <p className="text-gray-400 text-[14px]">@{profile.username}</p>
              </div>
              
              <p className="text-gray-300 max-w-lg text-[14px]">
                {profile.bio || 'Este usuario aún no tiene una biografía.'}
              </p>
              
              <div className="flex items-center gap-5 text-[13px] mt-1">
                <div className="flex gap-1.5 items-center"><span className="font-bold text-white">{profile.followingCount}</span> <span className="text-gray-500">Siguiendo</span></div>
                <div className="flex gap-1.5 items-center"><span className="font-bold text-white">{profile.followersCount}</span> <span className="text-gray-500">Seguidores</span></div>
                <div className="flex gap-1.5 items-center"><span className="font-bold text-white">{reviews.length}</span> <span className="text-gray-500">Reseñas</span></div>
              </div>
            </div>
          </div>
          
          {isOwnProfile ? (
            <Link href="/perfil">
              <Button variant="secondary" className="gap-2 self-center md:self-start bg-[#2A2A2A] hover:bg-[#333333] text-white border-none rounded-[4px] px-5 h-10 font-medium text-[14px]">
                <Settings className="w-4 h-4" /> Editar perfil
              </Button>
            </Link>
          ) : user ? (
            <FollowButton 
              followingId={profile.id}
              initialIsFollowing={isFollowing}
              username={profile.username}
            />
          ) : (
            <Link href="/login">
              <Button className="bg-[#FFED70] text-black hover:bg-[#FFED70]/90 rounded-[4px] font-bold text-[14px] px-6 h-10">
                Iniciar Sesión para Seguir
              </Button>
            </Link>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-gray-800 mb-10 overflow-x-auto no-scrollbar">
          <button className="flex items-center gap-2 px-6 py-4 border-b-2 border-[#FFED70] text-[#FFED70] font-medium whitespace-nowrap transition-colors text-[15px]">
            <Star className="w-[18px] h-[18px]" /> Reseñas Recientes
          </button>
        </div>

        {/* Reviews List */}
        <div className="flex flex-col gap-6">
          {reviews.length === 0 ? (
            <div className="text-center py-10 bg-[#202020] rounded-[8px] text-gray-500 text-[14px]">
              Este usuario no ha escrito ninguna reseña.
            </div>
          ) : (
            reviews.map((review: any) => (
              <div key={review.id} className="flex flex-col sm:flex-row gap-6 bg-[#202020] p-5 rounded-[8px] border-none shadow-sm">
                <Link href={`/anime/${review.animes.external_id}`} className="w-full sm:w-[160px] h-[160px] flex-shrink-0 rounded-[8px] overflow-hidden bg-[#101010] hover:opacity-80 transition-opacity">
                  <img src={review.animes.cover_image} alt={review.animes.title} className="w-full h-full object-cover" />
                </Link>
                
                <div className="flex flex-col flex-grow py-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Link href={`/anime/${review.animes.external_id}`} className="hover:underline">
                        <h3 className="text-[17px] font-bold text-white tracking-tight">{review.animes.title}</h3>
                      </Link>
                      <p className="text-[13px] text-gray-500 mt-0.5">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#2A2A2A] px-3 py-1.5 rounded-[4px] text-[13px] font-bold text-white">
                      <Star className="w-4 h-4 fill-[#FFED70] text-[#FFED70]" />
                      <span>{review.rating}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 bg-[#101010] p-5 rounded-[8px] flex-grow">
                    <div className="flex items-center gap-2 mb-3 text-[13px] text-white font-medium">
                      <MessageSquare className="w-4 h-4 text-gray-500" /> Reseña
                    </div>
                    <p className="text-gray-300 text-[14px] leading-relaxed whitespace-pre-line">
                      {review.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
      </div>
    </main>
  );
}
