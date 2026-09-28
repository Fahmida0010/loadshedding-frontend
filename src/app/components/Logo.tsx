import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  // সাইজ অনুযায়ী ক্লাস কনফিগারেশন
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link href="/" className={`flex items-center gap-2 group font-bold tracking-tight ${sizeClasses[size]} ${className}`}>
      {/* লোগো আইকন: লাইটনিং বোল্ট (বিদ্যুৎ/লোমহ্যাডিং রিলেটেড) */}
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20 transition-all duration-300">
        <svg 
          className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.2" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M13 10V3L4 14h7v7l9-11h-7z" 
          />
        </svg>
        
        {/* ছোট একটি ডট ইন্ডিকেটর (লাইভ বা স্ট্যাটাস বোঝাতে) */}
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse border-2 border-gray-900"></span>
      </div>

      {/* ব্র্যান্ডের নাম */}
      <div className="flex flex-col">
        <span className="text-amber-400 flex items-center">
          Load<span className="text-amber-400">Shedding</span>
        </span>
        <span className="text-[10px] uppercase font-medium text-gray-400 tracking-widest -mt-1">
          Tracker & Alert
        </span>
      </div>
    </Link>
  );
}