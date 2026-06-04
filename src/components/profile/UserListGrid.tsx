import Link from 'next/link'
import { FollowButton } from '@/components/profile/FollowButton'

interface UserListGridProps {
  users: any[]
  currentUserId: string | null
  followStatuses: Record<string, boolean>
  emptyMessage?: string
}

export function UserListGrid({ 
  users, 
  currentUserId, 
  followStatuses,
  emptyMessage = "No users found."
}: UserListGridProps) {

  if (users.length === 0) {
    return (
      <div className="text-center py-[60px] text-[#555] text-[15px]">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[16px]">
      {users.map((profile) => {
        const avatarUrl = profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username || 'Alex'}`
        const isCurrentUser = currentUserId === profile.id

        return (
          <div key={profile.id} className="flex items-center justify-between p-[24px] bg-[#1A1A1A] rounded-[12px] border border-[#222]">
            <Link href={`/${encodeURIComponent(profile.username)}`} className="flex items-center gap-[16px] no-underline">
              <div className="w-[60px] h-[60px] rounded-full overflow-hidden bg-[#222] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatarUrl} alt={profile.username} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#FFF] m-0 mb-[4px]">{profile.username}</h3>
                <p className="text-[13px] text-[#888] m-0 line-clamp-1">{profile.bio || 'No bio yet.'}</p>
              </div>
            </Link>
            
            {!isCurrentUser && currentUserId && (
              <FollowButton 
                followingId={profile.id} 
                initialIsFollowing={followStatuses[profile.id] || false}
                username={profile.username}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
