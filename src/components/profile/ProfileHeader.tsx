import { EditProfileModal } from '@/components/profile/EditProfileModal'

interface ProfileHeaderProps {
  profile: any
  followingCount: number
  followersCount: number
  reviewsCount: number
  avatarUrl: string
}

export function ProfileHeader({ profile, followingCount, followersCount, reviewsCount, avatarUrl }: ProfileHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-[40px] flex-col md:flex-row gap-[16px] md:gap-0">
      <div className="flex items-center gap-[20px]">
        {/* Avatar */}
        <div className="w-[80px] h-[80px] rounded-full overflow-hidden bg-[#1A1A1A] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div>
          <h1 className="text-[26px] font-bold text-[#FFFFFF] m-0 mb-[4px]">
            {profile?.username || 'Anonymous'}
          </h1>
          <p className="text-[14px] text-[#666] m-0 mb-[12px]">
            @{profile?.username || 'user'}
          </p>
          <p className="text-[14px] text-[#999] m-0 mb-[16px]">
            {profile?.bio || ''}
          </p>
          <div className="flex items-center gap-[20px] text-[14px]">
            <span>
              <strong className="text-[#FFFFFF]">{followingCount ?? 0}</strong>{' '}
              <span className="text-[#888]">Following</span>
            </span>
            <span>
              <strong className="text-[#FFFFFF]">{followersCount ?? 0}</strong>{' '}
              <span className="text-[#888]">Followers</span>
            </span>
            <span>
              <strong className="text-[#FFED70]">{reviewsCount}</strong>{' '}
              <span className="text-[#888]">Rated anime</span>
            </span>
          </div>
        </div>
      </div>

      {/* Edit profile modal */}
      <EditProfileModal initialUsername={profile?.username || ''} initialBio={profile?.bio || ''} />
    </div>
  )
}
