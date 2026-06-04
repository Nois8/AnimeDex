import { Users } from "lucide-react";

interface AnimeCharactersProps {
  characters: any[];
}

export function AnimeCharacters({ characters }: AnimeCharactersProps) {
  if (!characters || characters.length === 0) return null;

  return (
    <div className="bg-[#1A1A1A] rounded-[10px] p-[28px]">
      <h2 className="text-[18px] font-bold text-[#FFF] flex items-center gap-[8px] m-0 mb-[20px]">
        <Users className="w-[18px] h-[18px] text-[#FFED70]" /> Key Characters
      </h2>
      <div className="grid grid-cols-[repeat(3,1fr)] gap-[12px]">
        {characters.map((char: any) => (
          <div key={char.character.mal_id} className="flex flex-col gap-[8px]">
            <div className="w-full pb-[133%] relative rounded-[6px] overflow-hidden bg-[#222]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={char.character.images.webp.image_url}
                alt={char.character.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-[12px] font-semibold text-[#FFED70] m-0 mb-[2px] truncate">
                {char.character.name}
              </p>
              <p className="text-[11px] text-[#666] m-0">
                {char.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
