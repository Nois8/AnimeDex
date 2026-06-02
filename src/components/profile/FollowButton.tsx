'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { UserPlus, UserMinus } from 'lucide-react'
import { toggleFollowAction } from '@/controllers/profile.controller'

export function FollowButton({ 
  followingId, 
  initialIsFollowing, 
  username 
}: { 
  followingId: string; 
  initialIsFollowing: boolean;
  username: string;
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    // Optimistic Update
    setIsFollowing(!isFollowing)

    startTransition(async () => {
      const result = await toggleFollowAction(followingId, isFollowing, username)
      if (result.error) {
        setIsFollowing(isFollowing)
        alert(result.error)
      }
    })
  }

  return (
    <Button 
      onClick={handleToggle}
      disabled={isPending}
      className={`gap-2 self-center md:self-start border-none rounded-[4px] px-5 h-10 font-medium text-[14px] transition-colors ${
        isFollowing 
          ? 'bg-[#2A2A2A] hover:bg-[#333333] text-white' 
          : 'bg-[#FFED70] text-black hover:bg-[#FFED70]/90'
      }`}
    >
      {isFollowing ? (
        <>
          <UserMinus className="w-4 h-4" /> Unfollow
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" /> Follow
        </>
      )}
    </Button>
  )
}
