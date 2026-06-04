export default function AnimeDetailsLoading() {
  return (
    <main className="min-h-[100vh] bg-[#121212] pt-[80px] pb-[80px]">
      <div className="max-w-[1000px] mx-auto px-[56px] w-full animate-pulse">
        {/* HERO SKELETON */}
        <div className="flex gap-[28px] mb-[40px]">
          {/* Poster */}
          <div className="w-[200px] h-[200px] shrink-0 rounded-[10px] bg-[#1A1A1A]"></div>
          {/* Details */}
          <div className="flex flex-col justify-center flex-1">
            <div className="h-[34px] w-3/4 bg-[#1A1A1A] rounded-[4px] mb-[14px]"></div>
            {/* Badges */}
            <div className="flex gap-[8px] mb-[12px]">
              <div className="w-[40px] h-[24px] bg-[#222] rounded-full"></div>
              <div className="w-[60px] h-[24px] bg-[#222] rounded-full"></div>
              <div className="w-[80px] h-[24px] bg-[#222] rounded-full"></div>
            </div>
            {/* Genres */}
            <div className="flex gap-[8px] mb-[20px]">
              <div className="w-[70px] h-[26px] bg-[#1E1E1E] rounded-full"></div>
              <div className="w-[50px] h-[26px] bg-[#1E1E1E] rounded-full"></div>
            </div>
            {/* Action buttons */}
            <div className="flex gap-[12px]">
              <div className="w-[140px] h-[42px] bg-[#333] rounded-[6px]"></div>
              <div className="w-[42px] h-[42px] bg-[#202020] rounded-[4px]"></div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT SKELETON */}
        <div className="grid grid-cols-[1fr_300px] gap-[24px] mb-[56px]">
          {/* Left Column */}
          <div className="flex flex-col gap-[24px]">
            {/* Synopsis */}
            <div className="bg-[#1A1A1A] rounded-[10px] p-[28px]">
              <div className="h-[22px] w-[120px] bg-[#333] rounded-[4px] mb-[16px]"></div>
              <div className="h-[14px] w-full bg-[#222] rounded-[4px] mb-[8px]"></div>
              <div className="h-[14px] w-5/6 bg-[#222] rounded-[4px] mb-[8px]"></div>
              <div className="h-[14px] w-4/6 bg-[#222] rounded-[4px]"></div>
            </div>
            {/* Characters */}
            <div className="bg-[#1A1A1A] rounded-[10px] p-[28px]">
              <div className="h-[22px] w-[140px] bg-[#333] rounded-[4px] mb-[20px]"></div>
              <div className="grid grid-cols-[repeat(3,1fr)] gap-[12px]">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-[8px]">
                    <div className="w-full pb-[133%] rounded-[6px] bg-[#222]"></div>
                    <div className="h-[14px] w-3/4 mx-auto bg-[#333] rounded-[4px]"></div>
                    <div className="h-[12px] w-1/2 mx-auto bg-[#222] rounded-[4px]"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (Info Sidebar) */}
          <div className="bg-[#1A1A1A] rounded-[10px] p-[28px] h-fit">
            <div className="h-[22px] w-[160px] bg-[#333] rounded-[4px] mb-[24px]"></div>
            <div className="flex flex-col gap-[18px]">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col gap-[4px]">
                  <div className="h-[12px] w-[60px] bg-[#222] rounded-[4px]"></div>
                  <div className="h-[16px] w-[100px] bg-[#333] rounded-[4px] ml-[24px]"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
