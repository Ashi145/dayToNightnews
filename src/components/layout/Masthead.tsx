import Link from 'next/link';

export default function Masthead() {
  return (
    <div className="border-b border-[#121212]/10 bg-[#fefcf8]">
      <div className="container mx-auto px-4 py-5 md:py-7 flex flex-col items-center">
        {/* Logo Row */}
        <div className="w-full flex items-center justify-between max-w-[1400px]">
          <div className="hidden md:flex flex-col text-[10px] tracking-widest uppercase opacity-60 leading-tight">
            <span>Established 2026</span>
            <span className="font-bold text-[11px] text-[#c41e1a]">AI-Powered Newsroom</span>
            <span className="mt-1">Vol. I — No. 1</span>
          </div>

          <Link href="/" className="flex-1 flex flex-col items-center">
            <h1 className="masthead-title text-[28px] sm:text-[42px] md:text-[56px] tracking-tight text-[#121212] text-center">
              DAY TO NIGHT <span className="text-[#c41e1a]">NEWS</span>
            </h1>
            <div className="mt-2 flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase font-semibold opacity-70">
              <span className="h-px w-8 bg-black/20 hidden sm:block" />
              <span>Verified • Fastest • Global • AI Curated</span>
              <span className="h-px w-8 bg-black/20 hidden sm:block" />
            </div>
          </Link>

          <div className="hidden md:flex flex-col items-end text-[11px] tracking-wide leading-tight">
            <span className="bg-black text-white px-2 py-0.5 font-bold text-[10px] tracking-widest uppercase">Edition</span>
            <span className="mt-1 font-serif text-[13px]">International • U.S.</span>
            <span className="opacity-60">$ 4.50 / € 4.20</span>
          </div>
        </div>
      </div>
    </div>
  );
}
