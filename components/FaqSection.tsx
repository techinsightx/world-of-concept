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
// तू इन्हें अपने हिसाब सें बदल सकतै हऽ.
const FAQ_BG_IMAGES = [
  "/gallery4.jpg",
  "/gallery8.jpg",
  "/gallery10.jpg",
];

const faqItems: FaqItem[] = [
  {
    question: "World of Concept क्या हऽ?",
    answer:
      "World of Concept Bihar Board और BSEB students के लिए बनाया गया एक dedicated online coaching platform हऽ। यहाँ RK Sir Class 9, 10, 11 और 12 के Matric व Inter students को HD video lectures, smart notes PDF, live classes, model paper practice, subject-wise solutions और exam strategy provide करते हैं।",
    tag: "Platform",
    trending: true,
  },
  {
    question: "क्या यहाँ Bihar Board solutions PDF मिलते हैं?",
    answer:
      "हाँ। World of Concept पर Bihar Board के important questions, solved papers, model paper practice और subject-wise solutions — Mathematics, Science, Social Science, English, Hindi, Contemporary World Politics आदि — दिए जाते हैं। Logged-in students dashboard से study material access कर सकते हैं।",
    tag: "Solutions",
    trending: true,
  },
  {
    question: "Bihar Board Model Paper 2027 कहाँ मिलेगा?",
    answer:
      "World of Concept पर Bihar Board / BSEB Model Paper 2027 की practice, previous year solved papers और exam pattern के आधार पर preparation दी जाती हऽ। Students dashboard और YouTube channel @JoinWorldofConcept से access कर सकते हैं।",
    tag: "Model Paper",
    trending: true,
  },
  {
    question: "Class 11 और Class 12 दोनों की preparation होती हऽ?",
    answer:
      "हाँ। World of Concept Class 9, 10, 11 और 12 Bihar Board students के लिए courses और guidance देता हऽ। Class 12 के लिए Science, Commerce और Arts stream-wise preparation eligible batches में दी जाती हऽ, साथ ही concept maps और short tricks भी।",
    tag: "Class 11-12",
  },
  {
    question: "क्या यह platform पूरे India में available हऽ?",
    answer:
      "हाँ। World of Concept Alamnagar, Madhepura, Bihar से operate होता हऽ, लेकिन इसका online coaching platform Bihar Board और BSEB students के लिए पूरे India — सभी states — में available हऽ।",
    tag: "Online",
  },
  {
    question: "RK Sir की live classes कैसे join करें?",
    answer:
      "Students website पर login करके dashboard के live class section से join कर सकते हैं। RK Sir के latest lectures और live session updates YouTube channel @JoinWorldofConcept पर भी available होते हैं।",
    tag: "Live Class",
  },
  {
    question: "Bihar Board Result / Admit Card / Date Sheet की जानकारी कहाँ मिलेगी?",
    answer:
      "World of Concept पर Bihar Board Result, Admit Card, Date Sheet और Syllabus से जुड़ी updates students dashboard और Telegram channel @JoinWorldofConcept पर समय-समय पर दी जाती हैं।",
    tag: "Exam Updates",
  },
  {
    question: "क्या यह Hindi medium Bihar Board students के लिए suitable हऽ?",
    answer:
      "बिल्कुल। World of Concept specially Bihar Board students के लिए बनाया गया हऽ। यहाँ Hindi medium understanding, simple explanations, board-focused notes, concept maps और exam-oriented practice पर focus किया जाता हऽ।",
    tag: "Hindi Medium",
  },
  {
    question: "Contemporary World Politics, History, Geography का solution मिलेगा?",
    answer:
      "हाँ। Social Science और Class 12 के subjects जैसे History, Geography, Civics, Political Science, Economics और Contemporary World Politics की preparation important questions, map work और solutions के साथ RK Sir द्वारा कराई जाती हऽ।",
    tag: "Social Science",
  },
  {
    question: "Admission / enrollment कैसे करें?",
    answer:
      "आप website पर Sign Up करके अपना account बना सकते हैं। उसके बाद dashboard से available courses देखकर enrollment process शुरू कर सकते हैं। किसी भी दिक्कत में support@worldofconcept.in या +91 7979096954 पर संपर्क करें।",
    tag: "Admission",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative isolate min-h-[70vh] py-12 sm:py-20 overflow-hidden border-t border-orange-100/60 dark:border-slate-800/60 bg-transparent transition-colors duration-700"
    >
      {/* =====================================================
          DYNAMIC BACKGROUND
          - Light mode: cinematic image slider
          - Dark mode: rainbow matte changable background
          - No blur layer here
          ===================================================== */}
      <DynamicBackground
        images={FAQ_BG_IMAGES}
        zoomType="out"
        density={0.85}
        interactive
        showGrid
      />

      {/* =====================================================
          NON-BLUR CINEMATIC SCRIM
          सिर्फ readability के लिए, blur नहीं।
          ===================================================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-white/45 via-white/10 to-white/35 dark:from-black/35 dark:via-black/10 dark:to-black/45"
      />

      {/* Soft edge vignette, still no blur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(120%_90%_at_50%_50%,transparent_50%,rgba(255,255,255,0.18)_100%)] dark:bg-[radial-gradient(120%_90%_at_50%_50%,transparent_48%,rgba(2,6,23,0.42)_100%)]"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 border border-white/30 dark:border-white/10 shadow-lg mb-4">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tracking-wide">
              Trending FAQ
            </span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>

          <h2 id="faq-heading" className="text-2xl sm:text-5xl font-black mb-3">
            <span className="rainbow-shimmer-text">अक्सर पूछे जाने वाले</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600 dark:from-orange-400 dark:to-blue-400">
              सवाल
            </span>
          </h2>

          <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-lg max-w-2xl mx-auto">
            Bihar Board और BSEB students के लिए RK Sir और World of Concept से जुड़े सबसे जरूरी जवाब एक जगह।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-orange-100 dark:border-slate-700/50 text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              Class 9 to 12
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-orange-100 dark:border-slate-700/50 text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Smart Notes
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-orange-100 dark:border-slate-700/50 text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm">
              <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
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
                    ? "bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500 shadow-2xl shadow-blue-500/20"
                    : "bg-white/35 dark:bg-white/10 hover:bg-gradient-to-r hover:from-orange-500/50 hover:via-blue-500/50 hover:to-purple-500/50"
                }`}
              >
                <div className="rounded-[calc(1.5rem-1px)] bg-white/92 dark:bg-slate-900/88 overflow-hidden shadow-lg">
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
                            ? "bg-gradient-to-br from-orange-500 to-blue-600 text-white shadow-lg"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110"
                        }`}
                      >
                        <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          {faq.trending && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold">
                              <Flame className="w-3 h-3" />
                              Trending
                            </span>
                          )}
                          {faq.tag && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                              {faq.tag}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    <ChevronDown
                      className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-slate-500 dark:text-slate-400 transition-transform duration-500 ${
                        isOpen ? "rotate-180 text-orange-500" : ""
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
                        <div className="border-l-2 border-orange-500/30 pl-4">
                          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
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
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl rainbow-shimmer-bg text-white font-extrabold shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            और सवाल हैं? Telegram पर जुड़ें
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}