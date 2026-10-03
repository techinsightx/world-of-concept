// components/Logo.tsx
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
}

export default function Logo({ size = "medium", showText = true }: LogoProps) {
  const sizeMap = {
    small: { width: 40, height: 40, text: "text-lg" },
    medium: { width: 50, height: 50, text: "text-xl" },
    large: { width: 80, height: 80, text: "text-3xl" },
  };

  const { width, height, text } = sizeMap[size];

  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative overflow-hidden rounded-full shadow-lg group-hover:shadow-2xl transition-all duration-300">
        <Image
          src="/logo.png"
          alt="World of Concept Logo"
          width={width}
          height={height}
          className="object-cover"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-extrabold text-slate-900 ${text} tracking-tight`}>
            World of Concept
          </span>
          <span className="text-xs text-slate-500 font-medium">
            By RK Sir
          </span>
        </div>
      )}
    </Link>
  );
}