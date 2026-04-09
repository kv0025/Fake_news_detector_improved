"use client";

import { useState, useEffect, useRef } from "react";
import { RefreshCw, ShieldAlert, ShieldCheck, ShieldQuestion, FileText, Link as LinkIcon, History, ChevronRight, Activity, Eye, FilePieChart, Download, Share2, Search, ExternalLink, Clock, Type } from "lucide-react";
import { analyzeText, AnalysisResult } from "@/lib/aiAnalyzer";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const sampleTexts = {
  real: "Last week, researchers at the National Science Institute published a peer-reviewed study in the Journal of Medical Science demonstrating a new method for early detection of airborne specific pathogens using laser spectroscopy. The data, collected over 5 years across 12 countries, shows a 94% accuracy rate in controlled environments.",
  fake: "SHOCKING SECRET!! Doctors hate this one weird trick! My neighbor drank apple cider vinegar mixed with alien crystals and her cancer disappeared OVERNIGHT!! 100% true story they don't want you to know about! Share this before the government takes it down!!!",
  suspicious: "Sources say that a major tech CEO might step down next week following an undisclosed internal event. It is believed that an announcement is imminent, although company representatives have refused to answer our emails."
};

type InputMode = "text" | "url";

// Helper component for circular gauge
const CircularGauge = ({ value, label, color }: { value: number, label: string, color: string }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center w-20 h-20">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32" cy="32" r={radius}
            className="stroke-white/10" strokeWidth="6" fill="none"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            cx="32" cy="32" r={radius}
            className={color} strokeWidth="6" fill="none" strokeLinecap="round"
            strokeDasharray={circumference}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{value}%</span>
        </div>
      </div>
      <span className="text-xs text-white/60 font-medium uppercase tracking-wider">{label}</span>
    </div>
  );
};

export default function FakeNewsDetector() {
  const [mode, setMode] = useState<InputMode>("text");
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  // History state
  const [history, setHistory] = useState<{id: string, text: string, type: "text" | "url", result: AnalysisResult}[]>([]);

  // Auto-detect URL paste in text mode
  useEffect(() => {
    if (mode === "text" && text.trim().match(/^https?:\/\/[^\s]+$/)) {
      setMode("url");
    }
  }, [text, mode]);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    try {
      const res = await analyzeText(text);
      setResult(res);
      // Add to history
      setHistory(prev => [
        { id: Date.now().toString(), text: text.substring(0, 60) + "...", type: mode, result: res },
        ...prev
      ].slice(0, 5)); // Keep last 5
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = () => {
    if (!result) return;
    const reportStr = `AURA.AI ANALYSIS REPORT\n\nTarget: ${mode === "url" ? text : "Text Snippet"}\nClassification: ${result.classification}\nConfidence: ${result.confidence}%\n\nDetailed Explanation:\n${result.explanation}\n\nMetrics:\n- Clickbait Level: ${result.metrics.clickbaitLevel}%\n- Objectivity Score: ${result.metrics.objectivityScore}%\n- Sentiment: ${result.sentiment}\n- Bias: ${result.bias}\n`;
    const blob = new Blob([reportStr], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aura_Report_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`I just scanned something with Aura.AI. It detected a ${result?.confidence}% ${result?.classification} probability!`);
    alert("Results summary copied to clipboard!");
  };

  const getResultIcon = (classification: string) => {
    switch (classification) {
      case "Real": return <ShieldCheck className="w-12 h-12 text-emerald-400" />;
      case "Suspicious": return <ShieldQuestion className="w-12 h-12 text-amber-400" />;
      case "Fake": return <ShieldAlert className="w-12 h-12 text-rose-500" />;
      default: return null;
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Real": return "text-emerald-400 shadow-emerald-500/20";
      case "Suspicious": return "text-amber-400 shadow-amber-500/20";
      case "Fake": return "text-rose-500 shadow-rose-500/20";
      default: return "text-white";
    }
  };

  const strokeColorMap = {
    Real: "stroke-emerald-400",
    Suspicious: "stroke-amber-400",
    Fake: "stroke-rose-500"
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Main Detector Area */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Input Toggle & Pre-fills */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="glass-panel p-1 inline-flex w-full sm:w-auto">
            <button
              onClick={() => { setMode("text"); setResult(null); }}
              className={cn("flex-1 sm:flex-none px-6 py-2 rounded-xl text-sm font-semibold transition-all", mode === "text" ? "bg-white/10 text-white shadow-sm" : "text-white/50 hover:text-white")}
            >
              <FileText className="w-4 h-4 inline mr-2" /> Text
            </button>
            <button
              onClick={() => { setMode("url"); setResult(null); }}
              className={cn("flex-1 sm:flex-none px-6 py-2 rounded-xl text-sm font-semibold transition-all", mode === "url" ? "bg-white/10 text-white shadow-sm" : "text-white/50 hover:text-white")}
            >
              <LinkIcon className="w-4 h-4 inline mr-2" /> URL
            </button>
          </div>

          <AnimatePresence>
            {mode === "text" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2">
                <button onClick={() => setText(sampleTexts.real)} className="btn-outline text-xs">Real</button>
                <button onClick={() => setText(sampleTexts.suspicious)} className="btn-outline text-xs">Sus</button>
                <button onClick={() => setText(sampleTexts.fake)} className="btn-outline text-xs">Fake</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Box */}
        <motion.div layout className="glass-panel flex flex-col relative z-10 transition-all focus-within:ring-2 focus-within:ring-purple-500/50">
          {mode === "text" ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the article contents here to begin deep analysis..."
              className="w-full bg-transparent border-none outline-none resize-none px-6 mt-6 min-h-[200px] text-lg text-white placeholder:text-white/20"
            />
          ) : (
            <div className="p-6 mt-2 relative">
              <input 
                type="url"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="https://example.com/news-article"
                className="w-full bg-white/5 border border-white/10 outline-none rounded-xl px-5 py-4 text-white text-lg placeholder:text-white/20 focus:border-purple-500/50 transition-colors"
              />
              <p className="mt-4 text-sm text-white/40 italic flex items-center"><Activity className="w-4 h-4 mr-2" /> Analysis of live URLs is simulated in this environment.</p>
            </div>
          )}

          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/[0.02]">
            <div className="flex gap-4 text-xs text-white/40 font-mono tracking-widest uppercase items-center">
              {mode === "text" ? (
                <>
                  <span className="flex items-center"><Type className="w-3 h-3 mr-1" /> {text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
                  <span className="flex items-center hidden sm:flex"><FileText className="w-3 h-3 mr-1" /> {text.length} chars</span>
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> ~{Math.max(1, Math.ceil((text.trim() ? text.trim().split(/\s+/).length : 0) / 200))}m read</span>
                </>
              ) : (
                <span className="flex items-center"><Activity className="w-3 h-3 mr-1" /> Server Simulation</span>
              )}
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || text.trim().length === 0}
              className={cn("btn-elegant shadow-lg", (isAnalyzing || text.trim().length === 0) && "opacity-50")}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-3 animate-spin text-white/80" />
                  Processing...
                </>
              ) : (
                "Engage Analyzer"
              )}
            </button>
          </div>
        </motion.div>

        {/* Results Dashboard */}
        <AnimatePresence mode="wait">
          {result && !isAnalyzing && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
              className="glass-panel p-8 mt-2 relative overflow-hidden"
            >
              {/* Dynamic Glow background for result */}
              <div className={cn("absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[100px] opacity-20 pointer-events-none", 
                result.classification === "Real" ? "bg-emerald-500" : 
                result.classification === "Suspicious" ? "bg-amber-500" : "bg-rose-500"
              )}/>

              <div className="flex flex-col md:flex-row gap-8 items-start lg:items-center">
                {/* Big Result Badge */}
                <motion.div initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}} transition={{delay: 0.1, type: "spring"}} className="flex-shrink-0 flex flex-col items-center justify-center p-6 bg-white/[0.03] rounded-2xl border border-white/10 w-full md:w-auto relative z-10">
                  {getResultIcon(result.classification)}
                  <h3 className={cn("text-3xl font-bold mt-4 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]", getClassificationColor(result.classification))}>
                    {result.classification}
                  </h3>
                  <div className="mt-2 text-white/60 font-mono text-sm">
                    {result.confidence}% Confidence
                  </div>
                </motion.div>

                {/* Explanation */}
                <motion.div initial={{opacity: 0, x: 20}} animate={{opacity: 1, x: 0}} transition={{delay: 0.2}} className="flex-1 space-y-4 z-10">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xl font-semibold text-white/90">AI Synthesis</h4>
                    <div className="flex gap-2">
                      <button onClick={handleShare} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors" title="Copy results">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button onClick={handleExport} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors" title="Export report">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-white/70 leading-relaxed text-lg">
                    {result.explanation}
                  </p>
                  
                  {/* Flagged Keywords (if any fake keywords) */}
                  {result.flaggedKeywords && result.flaggedKeywords.length > 0 && (
                     <div className="mt-4 border-t border-white/10 pt-4">
                       <span className="text-xs text-rose-400 font-semibold uppercase tracking-wider block mb-2">Flagged Patterns Detected:</span>
                       <div className="flex flex-wrap gap-2">
                         {result.flaggedKeywords.map(kw => (
                           <span key={kw} className="px-2 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded text-xs">
                             "{kw}"
                           </span>
                         ))}
                       </div>
                     </div>
                  )}
                  
                  {/* Fact-Checking Hooks */}
                  {(result.classification === "Fake" || result.classification === "Suspicious") && result.suggestedQueries && (
                    <div className="mt-4 border-t border-white/10 pt-4">
                      <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider block mb-2 flex items-center"><Search className="w-3 h-3 mr-1"/> Fact-Check Suggestions:</span>
                      <div className="flex flex-col gap-2">
                        {result.suggestedQueries.map((query, i) => (
                           <a key={i} href={`https://www.google.com/search?q=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-cyan-400 hover:text-cyan-300 transition-colors group">
                             <span>Search: "{query}"</span>
                             <ExternalLink className="w-3 h-3 ml-2 opacity-50 group-hover:opacity-100" />
                           </a>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Gauges Grid */}
              <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} transition={{delay: 0.3}} className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-white/10 z-10 relative">
                <CircularGauge 
                  value={result.metrics.clickbaitLevel} 
                  label="Clickbait" 
                  color={result.metrics.clickbaitLevel > 60 ? "stroke-rose-500" : result.metrics.clickbaitLevel > 30 ? "stroke-amber-400" : "stroke-emerald-400"} 
                />
                <CircularGauge 
                  value={result.metrics.objectivityScore} 
                  label="Objectivity" 
                  color={result.metrics.objectivityScore < 40 ? "stroke-rose-500" : result.metrics.objectivityScore < 70 ? "stroke-amber-400" : "stroke-emerald-400"} 
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="h-20 flex flex-col items-center justify-center space-y-2 group relative">
                    <span className="text-sm text-white/60">Sentiment</span>
                    <span className={cn("text-xl font-bold", 
                      result.sentiment === "Negative" ? "text-rose-400" : 
                      result.sentiment === "Positive" ? "text-emerald-400" : "text-blue-400"
                    )}>{result.sentiment}</span>
                    <span className="text-sm text-white/60 mt-1">Bias Lens</span>
                    <span className="text-sm font-semibold text-white/80">{result.bias}</span>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sidebar - History */}
      <div className="lg:col-span-4 h-full flex">
        <div className="glass-panel p-6 w-full flex flex-col">
          <div className="flex items-center gap-2 mb-6 text-white/80">
            <History className="w-5 h-5" />
            <h3 className="font-semibold text-lg tracking-wide">Recent Scans</h3>
          </div>
          
          <div className="flex-1 space-y-3 overflow-y-auto pr-2">
            <AnimatePresence>
              {history.length === 0 ? (
                <motion.div initial={{opacity: 0}} animate={{opacity:1}} className="text-center text-white/30 py-10 px-4 text-sm border border-dashed border-white/10 rounded-xl">
                  Your analysis history will appear here.
                </motion.div>
              ) : (
                history.map((item, idx) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors cursor-pointer group"
                    onClick={() => {
                      setText(item.text);
                      setMode(item.type);
                      setResult(item.result);
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={cn("text-xs font-bold uppercase tracking-wider",
                        item.result.classification === "Real" ? "text-emerald-400" :
                        item.result.classification === "Suspicious" ? "text-amber-400" : "text-rose-400"
                      )}>
                        {item.result.classification} &middot; {item.result.confidence}%
                      </span>
                      {item.type === "url" ? <LinkIcon className="w-3 h-3 text-white/40" /> : <FileText className="w-3 h-3 text-white/40" />}
                    </div>
                    <p className="text-sm text-white/60 line-clamp-2 leading-relaxed">
                      {item.text}
                    </p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
