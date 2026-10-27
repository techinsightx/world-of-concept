/* eslint-disable */
"use client";

import { useState } from "react";
import MagneticButton from "@/components/MagneticButton";
import DynamicBackground from "@/components/DynamicBackground";
import {
  ChevronDown,
  Flame,
  HelpCircle,
  Sparkles,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  tag?: string;
  trending?: boolean;
}

// FAQ section के लिए cinematic gallery images.
const FAQ_BG_IMAGES = [
  "/gallery4.jpg",
  "/gallery8.jpg",
  "/gallery10.jpg",
];

const faqItems: FaqItem[] = [
  {
    question: "World of Concept क्या है?",
    answer:
      "World of Concept Bihar Board और BSEB students के लिए बनाया गया एक dedicated online coaching platform है। यहां RK Sir Class 9, 10, 11 और 12 के Matric व Inter students को HD video lectures, smart notes PDF, live classes, model paper practice, subject-wise solutions और exam strategy provide करते हैं।",
    tag: "Platform",
    trending: true,
  },
  {
    question: "क्या यहां Bihar Board solutions PDF मिलते हैं?",
    answer:
      "हाँ। World of Concept पर Bihar Board के important questions, solved papers, model paper practice और subject-wise solutions — Mathematics, Science, Social Science, English, Hindi, Contemporary World Politics आदि — दिए जाते हैं। Logged-in students dashboard से study material access कर सकते हैं।",
    tag: "Solutions",
    trending: true,
  },
  {
    question: "Bihar Board Model Paper 2027 कहां मिलेगा?",
    answer:
      "World of Concept पर Bihar Board / BSEB Model Paper 2027 की practice, previous year solved papers और exam pattern के आधार पर preparation दी जाती है। Students dashboard और YouTube channel @JoinWorldofConcept से access कर सकते हैं।",
    tag: "Model Paper",
    trending: true,
  },
  {
    question: "Class 11 और Class 12 दोनों की preparation होती है?",
    answer:
      "हाँ। World of Concept Class 9, 10, 11 और 12 Bihar Board students के लिए courses और guidance देता है। Class 12 के लिए Science, Commerce और Arts stream-wise preparation eligible batches में दी जाती है, साथ ही concept maps और short tricks भी।",
    tag: "Class 11-12",
  },
  {
    question: "क्या यह platform पूरे India में available है?",
    answer:
      "हाँ। World of Concept Alamnagar, Madhepura, Bihar से operate होता है, लेकिन इसका online coaching platform Bihar Board और BSEB students के लिए पूरे India — सभी states — में available है।",
    tag: "Online",
  },
  {
    question: "RK Sir की live classes कैसे join करें?",
    answer:
      "Students website पर login करके dashboard के live class section से join कर सकते हैं। RK Sir के latest lectures और live session updates YouTube channel @JoinWorldofConcept पर भी available होते हैं।",
    tag: "Live Class",
  },
  {
    question: "Bihar Board Result / Admit Card / Date Sheet की जानकारी कहां मिलेगी?",
    answer:
      "World of Concept पर Bihar Board Result, Admit Card, Date Sheet और Syllabus से जुड़ी updates students dashboard और Telegram channel @JoinWorldofConcept पर समय-समय पर दी जाती हैं।",
    tag: "Exam Updates",
  },
  {
    question: "क्या यह Hindi medium Bihar Board students के लिए suitable है?",
    answer:
      "बिल्कुल। World of Concept specially Bihar Board students के लिए बनाया गया है। यहां Hindi medium understanding, simple explanations, board-focused notes, concept maps और exam-oriented practice पर focus किया जाता है।",
    tag: "Hindi Medium",
  },
  {
    question: "Contemporary World Politics, History, Geography का solution मिलेगा?",
    answer:
      "हाँ। Social Science और Class 12 के subjects जैसे History, Geography, Civics, Political Science, Economics और Contemporary World Politics की preparation important questions, map work और solutions के साथ RK Sir द्वारा कराई जाती है।",
    tag: "Social Science",
  },
  {
    question: "Admission / enrollment कैसे करें?",
    answer:
      "आप website पर Sign Up करके अपना account बना सकते हैं। उसके बाद dashboard से available courses देखकर enrollment process शुरू कर सकते हैं। किसी भी दिक्कत में support@worldofconcept.in या +91 7979096954 पर संपर्क करें।",
    tag: "Admission",
  },
];

// ==============================
// INJECTED STYLES FOR MATTE WAVES & PREMIUM LOOK
// ==============================
const FAQ_STYLES = `
@keyframes waveFlowLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes waveFlowRight {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

.faq-wave-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  mix-blend-mode: screen; /* Glows over dark bg */
  opacity: 0.3; /* Subtle but visible */
  overflow: hidden;
}

.faq-wave-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background-size: 50% 100%;
  background-repeat: repeat-x;
}

.faq-wave-left {
  animation: waveFlowLeft 20s linear infinite;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15), transparent 60%),
    radial-gradient(circle at 80% 20%, rgba(34, 211, 238, 0.15), transparent 60%);
}

.faq-wave-right {
  animation: waveFlowRight 25s linear infinite;
  background-image: 
    radial-gradient(circle at 30% 30%, rgba(249, 115, 22, 0.12), transparent 60%),
    radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.12), transparent 60%);
}

/* Matte Typography Utilities for FAQ */
.text-matte-primary {
  color: #f8fafc; /* slate-50 */
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}
.text-matte-secondary {
  color: #cbd5e1; /* slate-300 */
}
`;

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative isolate min-h-[70vh] py-12 sm:py-20 overflow-hidden border-t border-slate-800/50 bg-slate-950 transition-colors duration-700"
    >
      <style dangerouslySetInnerHTML={{ __html: FAQ_STYLES }} />

      {/* =====================================================
          DYNAMIC BACKGROUND ENGINE
          ===================================================== */}
      <DynamicBackground
        images={FAQ_BG_IMAGES}
        zoomType="out"
        density={0.85}
        interactive
        showGrid
      />

      {/* Dark Overlay to ensure matte look */}
      <div className="absolute inset-0 z-[2] bg-slate-950/80 backdrop-blur-sm" />

      {/* --- INTERNAL DUAL WAVE ENGINE --- */}
      <div className="faq-wave-container">
        <div className="faq-wave-layer faq-wave-left" />
        <div className="faq-wave-layer faq-wave-right" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 dark:bg-slate-900/50 border border-white/10 shadow-lg mb-4 backdrop-blur-md">
            <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-extrabold text-white tracking-wide">
              Trending FAQ
            </span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>

          {/* Title: Pure Matte White/Grey, No Rainbow Gradient */}
          <h2 id="faq-heading" className="text-2xl sm:text-5xl font-black mb-3 text-matte-primary">
            अक्सर पूछे जाने वाले सवाल
          </h2>

          <p className="text-slate-400 dark:text-slate-500 text-sm sm:text-lg max-w-2xl mx-auto">
            Bihar Board और BSEB students के लिए RK Sir और World of Concept से जुड़े सबसे जरूरी जवाब एक जगह।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 dark:bg-slate-900/50 border border-white/10 text-[10px] sm:text-xs font-bold text-slate-300 shadow-sm backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
              Class 9 to 12
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 dark:bg-slate-900/50 border border-white/10 text-[10px] sm:text-xs font-bold text-slate-300 shadow-sm backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Smart Notes
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 dark:bg-slate-900/50 border border-white/10 text-[10px] sm:text-xs font-bold text-slate-300 shadow-sm backdrop-blur-md">
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              Live Support
            </span>
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-3 sm:space-y-4">
          {faqItems.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`group relative rounded-3xl p-[1px] transition-all duration-500 ${
                  isOpen
                    ? "bg-white/20 shadow-2xl shadow-white/5" // Matte Border Glow
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="rounded-[calc(1.5rem-1px)] bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xl overflow-hidden shadow-lg border border-white/5">
                  <button
                    id={`faq-trigger-${index}`}
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${index}`}
                    className="w-full flex items-start justify-between gap-4 p-4 sm:p-6 text-left"
                  >
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                      <div
                        className={`mt-0.5 w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                          isOpen
                            ? "bg-white text-slate-900 shadow-lg" // Inverted Matte Icon
                            : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                        }`}
                      >
                        <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          {faq.trending && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-[10px] font-bold">
                              <Flame className="w-3 h-3" />
                              Trending
                            </span>
                          )}
                          {faq.tag && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-bold">
                              {faq.tag}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-xl font-extrabold text-white leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    <ChevronDown
                      className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-slate-400 transition-transform duration-500 ${
                        isOpen ? "rotate-180 text-white" : ""
                      }`}
                    />
                  </button>

                  <div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${index}`}
                    className={`overflow-hidden transition-all duration-500 ease-out ${
                      isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-4 sm:px-6 pb-5 sm:pb-6">
                      <div className="pl-12 sm:pl-16">
                        <div className="border-l-2 border-white/20 pl-4">
                          <p className="text-slate-300 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <MagneticButton
            href="https://t.me/JoinWorldofConcept"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 font-extrabold shadow-lg hover:bg-gray-100 transition-all duration-300"
          >
            <Sparkles className="w-5 h-5" />
            और सवाल हैं? Telegram पर जुड़ें
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}