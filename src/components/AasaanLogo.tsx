import React from "react";

interface AasaanLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  onClick?: () => void;
  interactive?: boolean;
  className?: string;
}

export const AasaanLogo: React.FC<AasaanLogoProps> = ({
  size = "md",
  showTagline = true,
  onClick,
  interactive = true,
  className = "",
}) => {
  const sizeMap = {
    sm: {
      crestSize: "w-7 h-7",
      tamilTitleSize: "text-base",
      engTitleSize: "text-xs",
      taglineSize: "text-[9px]",
    },
    md: {
      crestSize: "w-9 h-9",
      tamilTitleSize: "text-xl",
      engTitleSize: "text-sm",
      taglineSize: "text-[10px]",
    },
    lg: {
      crestSize: "w-12 h-12",
      tamilTitleSize: "text-2xl",
      engTitleSize: "text-base",
      taglineSize: "text-xs",
    },
    xl: {
      crestSize: "w-16 h-16",
      tamilTitleSize: "text-3xl",
      engTitleSize: "text-lg",
      taglineSize: "text-sm",
    },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div
      className={`group flex items-center gap-3 select-none text-left ${
        interactive
          ? "cursor-pointer transition-all duration-300 transform active:scale-95"
          : ""
      } ${className}`}
      onClick={onClick}
      role={interactive && onClick ? "button" : undefined}
      tabIndex={interactive && onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (interactive && onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      title={interactive ? "ஆசான் - ஆசிரியர் பெருமை மற்றும் விரைவு வழிகாட்டி (Click to explore)" : undefined}
    >
      {/* Tamil Pedagogical Crest: "அ" + Olai Chuvadi + Peacock Quill + Agal Vilakku */}
      <div className="relative flex-shrink-0">
        {/* Ambient Glow behind crest */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500/30 via-red-500/20 to-amber-600/30 blur-xs group-hover:blur-sm opacity-80 group-hover:opacity-100 transition-all duration-300" />

        {/* Crest Outer Container */}
        <div
          className={`${currentSize.crestSize} relative rounded-xl bg-gradient-to-br from-[#181124] via-[#241432] to-[#120a1c] p-0.5 border border-amber-400/60 shadow-md group-hover:border-amber-300 group-hover:shadow-amber-500/25 group-hover:scale-105 transition-all duration-300 flex items-center justify-center overflow-hidden`}
        >
          {/* Subtle Radial Aura */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.3)_0%,transparent_75%)] animate-pulse" />

          {/* Premium Vector Crest SVG */}
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full p-1 drop-shadow"
          >
            <defs>
              <linearGradient id="aasaanGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="45%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="aasaanFlame" x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
              <linearGradient id="olaiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>

            {/* Sun Aura Ring with 12 Tamil Wisdom Dots */}
            <g className="opacity-90 group-hover:rotate-12 transition-transform duration-500 origin-center">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <circle
                  key={deg}
                  cx={24 + 18 * Math.cos((deg * Math.PI) / 180)}
                  cy={24 + 18 * Math.sin((deg * Math.PI) / 180)}
                  r="1.1"
                  fill="url(#aasaanGold)"
                  className="opacity-80"
                />
              ))}
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="url(#aasaanGold)"
                strokeWidth="0.8"
                strokeDasharray="2 3"
                className="opacity-50"
              />
            </g>

            {/* Ancient Palm Leaf Scripture (ஓலைச்சுவடி - Olai Chuvadi) Base */}
            <path
              d="M10 33C14 31 19 32 24 34.5C29 32 34 31 38 33V22C34 20 29 21 24 23.5C19 21 14 20 10 22V33Z"
              fill="#20152e"
              stroke="url(#aasaanGold)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Center leaf ribbon */}
            <line
              x1="24"
              y1="23.5"
              x2="24"
              y2="34.5"
              stroke="url(#aasaanGold)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Stylus / Peacock Quill (மயில் தோகை எழுத்தாணி) */}
            <path
              d="M36 9C34 14 30 20 25 27L23 29L24 26C27 21 31 15 36 9Z"
              fill="url(#aasaanGold)"
              className="drop-shadow-sm opacity-90"
            />
            <path
              d="M36 9C38 12 36 17 33 21"
              stroke="#fef08a"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Sacred Tamil Root Letter "அ" (Akara Mudhala - First Letter of Wisdom) */}
            <text
              x="23.5"
              y="22"
              textAnchor="middle"
              fill="url(#aasaanGold)"
              fontSize="12"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              className="select-none tracking-tight"
            >
              அ
            </text>

            {/* Agal Vilakku Knowledge Flame (அறிவு விளக்குச் சுடர்) at Top */}
            <path
              d="M24 6C23 8.5 21.5 10 21.5 11.5C21.5 13 22.5 14 24 14C25.5 14 26.5 13 26.5 11.5C26.5 10 25 8.5 24 6Z"
              fill="url(#aasaanFlame)"
              className="animate-pulse origin-bottom"
            />
          </svg>
        </div>

        {/* Small Golden Sparkle on Hover */}
        {interactive && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 border border-white"></span>
          </span>
        )}
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          {/* Tamil Name: ஆசான் */}
          <span
            className={`${currentSize.tamilTitleSize} font-extrabold tracking-tight bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 bg-clip-text text-transparent group-hover:brightness-110 transition-all leading-none`}
            style={{ fontFamily: "'Mukta Malar', 'Noto Sans Tamil', sans-serif" }}
          >
            ஆசான்
          </span>

          {/* English Tracked Sub-name: AASAAN */}
          <span
            className={`${currentSize.engTitleSize} font-black tracking-widest text-slate-200 group-hover:text-white transition-colors leading-none`}
          >
            AASAAN
          </span>

          {/* Badge: ஆசிரியர் தளம் */}
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 tracking-wide">
            ஆசிரியர் தளம்
          </span>
        </div>

        {showTagline && (
          <span
            className={`${currentSize.taglineSize} text-slate-400 group-hover:text-amber-200/90 transition-colors font-medium tracking-wide flex items-center gap-1 mt-0.5`}
          >
            <span>கற்க கசடற • Master Pedagogy Suite</span>
            {interactive && (
              <span className="text-[9px] text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                ✦ அறிவை திற
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );

  return content;
};
