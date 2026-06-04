import { Info, Tv, MonitorPlay, Clock, Calendar, BookOpen, Users, ShieldAlert, Star } from "lucide-react";

import { JikanAnime, DatabaseAnime } from "@/types/anime";

interface AnimeInfoSidebarProps {
  fullAnime: JikanAnime;
  dbAnime: DatabaseAnime;
}

export function AnimeInfoSidebar({ fullAnime, dbAnime }: AnimeInfoSidebarProps) {
  const statusText =
    fullAnime.status === "Finished Airing"
      ? "Finished"
      : fullAnime.status === "Currently Airing"
      ? "Airing"
      : fullAnime.status;

  const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex flex-col gap-[4px]">
      <div className="flex items-center gap-[8px] text-[12px] text-[#666]">
        {icon} {label}
      </div>
      <div className="text-[14px] font-medium text-[#FFF] pl-[24px]">{value}</div>
    </div>
  );

  return (
    <div className="bg-[#1A1A1A] rounded-[10px] p-[28px] sticky top-[100px]">
      <h2 className="text-[18px] font-bold text-[#FFF] flex items-center gap-[8px] m-0 mb-[24px]">
        <Info className="w-[18px] h-[18px] text-[#FFED70]" /> General Information
      </h2>

      <div className="flex flex-col gap-[18px]">
        <InfoRow icon={<Tv className="w-[14px] h-[14px]" />} label="Type" value={fullAnime.type || "Unknown"} />
        <InfoRow icon={<MonitorPlay className="w-[14px] h-[14px]" />} label="Episodes" value={String(fullAnime.episodes || "?")} />
        <InfoRow icon={<Clock className="w-[14px] h-[14px]" />} label="Duration" value={fullAnime.duration || "Unknown"} />
        <InfoRow
          icon={<Calendar className="w-[14px] h-[14px]" />}
          label="Premiered"
          value={fullAnime.season && fullAnime.year ? `${fullAnime.season} ${fullAnime.year}` : "Unknown"}
        />
        <InfoRow icon={<Info className="w-[14px] h-[14px]" />} label="Status" value={statusText || "Unknown"} />
        <InfoRow icon={<BookOpen className="w-[14px] h-[14px]" />} label="Source" value={fullAnime.source || "Unknown"} />
        <InfoRow icon={<Users className="w-[14px] h-[14px]" />} label="Studio" value={fullAnime.studios?.[0]?.name || "Unknown"} />
        <InfoRow icon={<ShieldAlert className="w-[14px] h-[14px]" />} label="Rating" value={fullAnime.rating || "Unknown"} />

        {/* Score */}
        <div className="mt-[8px] pt-[18px] border-t border-[#2A2A2A]">
          <div className="flex items-center gap-[8px] text-[12px] text-[#666] mb-[10px]">
            <Star className="w-[14px] h-[14px]" /> Score
          </div>
          <div className="flex items-center gap-[10px] pl-[24px]">
            <div className="flex items-center gap-[6px] bg-[#3D3A20] px-[12px] py-[6px] rounded-[6px]">
              <Star className="w-[16px] h-[16px] fill-[#FFED70] text-[#FFED70]" />
              <span className="text-[#FFF] font-bold text-[16px]">
                {dbAnime?.average_score || 0}
              </span>
            </div>
            <span className="text-[11px] text-[#666]">
              based on {dbAnime?.total_reviews || 0} reviews
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
