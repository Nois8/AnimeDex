import Link from 'next/link'
import { Star, Heart, Users, List } from 'lucide-react'

interface ProfileTabsProps {
  currentTab: string
}

export function ProfileTabs({ currentTab }: ProfileTabsProps) {
  const tabs = [
    { id: 'puntuados', icon: <Star className="w-[16px] h-[16px]" style={{ fill: currentTab === 'puntuados' ? 'none' : 'none' }} />, label: 'Rated' },
    { id: 'favoritos', icon: <Heart className={`w-[16px] h-[16px] ${currentTab === 'favoritos' ? 'fill-[#FFED70] text-[#FFED70]' : 'text-[#888]'}`} />, label: 'Favorites' },
    { id: 'milista', icon: <List className="w-[16px] h-[16px]" />, label: 'Watchlist' },
    { id: 'siguiendo', icon: <Users className="w-[16px] h-[16px]" />, label: 'Following' },
    { id: 'seguidores', icon: <Users className="w-[16px] h-[16px]" />, label: 'Followers' },
  ]

  return (
    <div className="flex items-center gap-[20px] md:gap-[32px] border-b border-[#2A2A2A] mb-[32px] overflow-x-auto overflow-y-hidden whitespace-nowrap hide-scrollbar">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <Link
            key={tab.id}
            href={`?tab=${tab.id}`}
            className={`flex items-center gap-[6px] py-[12px] text-[14px] no-underline -mb-[1px] ${
              isActive 
                ? 'border-b-2 border-[#FFED70] text-[#FFED70] font-semibold' 
                : 'border-b-2 border-transparent text-[#888] font-normal hover:text-[#BBB]'
            }`}
          >
            {tab.icon} {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
