/* eslint-disable */
"use client";

import Image from "next/image";
import MagneticButton from "@/components/MagneticButton";
import { ExternalLink, Mail, Phone, MapPin, Globe } from "lucide-react";

const SITE_URL = "https://worldofconcept.in";

const YOUTUBE_URL = "https://youtube.com/@JoinWorldofConcept";
const INSTAGRAM_URL = "https://instagram.com/join_world_of_concept";
const FACEBOOK_URL = "https://facebook.com/worldofconcept";
const TELEGRAM_URL = "https://t.me/JoinWorldofConcept";

// Custom SVG Icons for Social Media (Kept from original for consistency)
const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
      fill="#FF0000"
    />
    <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="footer-insta-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FD5" />
        <stop offset="50%" stopColor="#FF543E" />
        <stop offset="100%" stopColor="#C837AB" />
      </linearGradient>
    </defs>
    <path
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"
      fill="url(#footer-insta-grad)"
    />
    <path
      d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
      fill="#FFFFFF"
    />
    <circle cx="18.406" cy="5.594" r="1.44" fill="#FFFFFF" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      fill="#1877F2"
    />
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0z"
      fill="#0088CC"
    />
    <path
      d="M4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
      fill="#FFFFFF"
    />
  </svg>
);

export default function SiteFooter() {
  // Satellite View URL with specific coordinates for Alamnagar, Madhepura
  const MAP_SRC = "https://www.google.com/maps?q=Alamnagar,+Madhepura,+Bihar,+India&hl=en&z=16&output=embed&maptype=satellite";

  return (
    <footer className="relative bg-slate-950 text-slate-400 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 w-full overflow-hidden border-t border-slate-800/50">
      
      {/* =====================================================
          BACKGROUND: SATALLITE VIEW MAP (CRYSTAL CLEAR)
          ===================================================== */}
      <div className="absolute inset-0 z-0">
        <iframe
          className="w-full h-full object-cover opacity-40 grayscale-[0.2]" // Subtle desaturation for matte look
          src={MAP_SRC}
          style={{
            border: 0,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin allow-popups"
          title="World of Concept Location - Satellite View"
          allowFullScreen
        />

        {/* Dark Gradient Overlay to ensure text readability over satellite map */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/85 to-slate-950/95" />
        
        {/* Vignette Effect for Cinematic Feel */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Top Section: Logo & Location Badge */}
        <div className="mb-10 flex flex-col items-center gap-4">
           <div className="flex items-center gap-3">
             <Image
                src="/logo.png"
                alt="World of Concept"
                width={48}
                height={48}
                className="object-contain drop-shadow-lg"
                sizes="48px"
              />
              <span className="font-black text-xl sm:text-2xl tracking-tight text-white">
                World of Concept
              </span>
           </div>

           <MagneticButton
            href="https://www.google.com/maps/search/Alamnagar+Madhepura+Bihar"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full shadow-lg transition-all duration-300 border border-white/10 hover:border-white/20"
          >
            <MapPin className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-bold tracking-wide text-white">
              आलमनगर, मधेपुरा, बिहार
            </span>
            <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-orange-400 transition-colors" />
          </MagneticButton>
        </div>

        {/* Main Grid: Organized Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Column 1: About & Mission */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2 mb-4">
              हमारा मिशन
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
              बिहार के छात्रों को विश्व स्तरीय शिक्षा प्रदान करना। 
              RK Sir द्वारा चलाया गया यह प्लेटफॉर्म Bihar Board और BSEB students के लिए dedicated online coaching, smart notes, solutions और live classes प्रदान करता है।
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              <MagneticButton
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Channel"
                className="w-9 h-9 rounded-lg bg-slate-900/50 backdrop-blur-sm flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-800 hover:border-red-500"
              >
                <YoutubeIcon className="w-4 h-4" />
              </MagneticButton>

              <MagneticButton
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className="w-9 h-9 rounded-lg bg-slate-900/50 backdrop-blur-sm flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-800 hover:border-pink-500"
              >
                <InstagramIcon className="w-4 h-4" />
              </MagneticButton>

              <MagneticButton
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Page"
                className="w-9 h-9 rounded-lg bg-slate-900/50 backdrop-blur-sm flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-800 hover:border-blue-500"
              >
                <FacebookIcon className="w-4 h-4" />
              </MagneticButton>

              <MagneticButton
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram Group"
                className="w-9 h-9 rounded-lg bg-slate-900/50 backdrop-blur-sm flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all duration-300 shadow-sm border border-slate-800 hover:border-sky-400"
              >
                <TelegramIcon className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2 mb-4">
              त्वरित लिंक
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li>
                <a
                  href="/courses"
                  className="hover:text-orange-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-slate-600 rounded-full group-hover:bg-orange-400 transition-colors"></span>
                  सभी Courses देखें
                </a>
              </li>
              <li>
                <a
                  href="/#why-choose-us"
                  className="hover:text-orange-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-slate-600 rounded-full group-hover:bg-orange-400 transition-colors"></span>
                  क्यों चुनें?
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="hover:text-orange-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-slate-600 rounded-full group-hover:bg-orange-400 transition-colors"></span>
                  Student Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="hover:text-orange-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-slate-600 rounded-full group-hover:bg-orange-400 transition-colors"></span>
                  FAQ / सहायता
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Policies */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2 mb-4">
              कानूनी जानकारी
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li>
                <a
                  href="/privacy"
                  className="hover:text-orange-400 transition-colors flex items-center gap-2 group"
                >
                  <Globe className="w-3 h-3 text-slate-600 group-hover:text-orange-400 transition-colors" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="hover:text-orange-400 transition-colors flex items-center gap-2 group"
                >
                  <Globe className="w-3 h-3 text-slate-600 group-hover:text-orange-400 transition-colors" />
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/refund"
                  className="hover:text-orange-400 transition-colors flex items-center gap-2 group"
                >
                  <Globe className="w-3 h-3 text-slate-600 group-hover:text-orange-400 transition-colors" />
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Support */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2 mb-4">
              संपर्क करें
            </h4>
            <ul className="space-y-4 text-xs sm:text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold mb-0.5">Email</p>
                  <a href="mailto:support@worldofconcept.in" className="text-white hover:text-orange-400 transition-colors break-all">
                    support@worldofconcept.in
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold mb-0.5">Phone</p>
                  <a href="tel:+917979096954" className="text-white hover:text-orange-400 transition-colors">
                    +91 7979096954
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold mb-0.5">Address</p>
                  <p className="text-white leading-relaxed">
                    Alamnagar, Madhepura,<br/>
                    Bihar, India - 852113
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Credits */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs text-slate-500">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} <span className="text-white font-semibold">World of Concept</span>. सर्वाधिकार सुरक्षित।
          </p>

          <MagneticButton
            href="https://www.google.com/search?q=Mukesh+Kumar+Malakar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-orange-400 transition-colors group"
            title="Designed and Developed by Mukesh Kumar Malakar"
          >
            <span>Designed & Developed with</span>
            <svg className="w-3 h-3 text-red-500 animate-pulse group-hover:scale-125 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="font-bold text-white">Mukesh Kumar Malakar</span>
          </MagneticButton>
        </div>
      </div>
    </footer>
  );
}