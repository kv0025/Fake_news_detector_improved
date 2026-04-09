"use client";

import { motion } from "framer-motion";

export default function AnimatedHero() {
  return (
    <header className="flex flex-col items-center text-center space-y-6 mt-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="inline-flex items-center px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold uppercase tracking-widest mb-2 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
      >
        Powered by Next-Gen AI
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "backOut", delay: 0.1 }}
        className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-sm leading-tight max-w-4xl"
      >
        Detect fiction. <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400">
          Illuminate the truth.
        </span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light"
      >
        Deploy deep neural analysis to dissect articles, URLs, and snippets. Identify manipulative language, bias, and clickbait in milliseconds.
      </motion.p>
    </header>
  );
}
