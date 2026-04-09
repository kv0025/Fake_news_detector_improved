import FakeNewsDetector from "@/components/FakeNewsDetector";
import AnimatedHero from "@/components/AnimatedHero";
import { Radar } from "lucide-react";

export const metadata = {
  title: "Aura | AI Truth Engine",
  description: "A premium AI-powered detection suite to analyze and verify digital content.",
};

export default function Home() {
  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 flex flex-col items-center selection:bg-purple-500/30 selection:text-white relative">
      <div className="bg-orb-1" />
      <div className="bg-orb-2" />
      
      {/* Top Navbar Simulation */}
      <nav className="w-full max-w-7xl flex items-center justify-between py-6 px-4 z-10 mb-8 rounded-2xl bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="relative">
             <Radar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 animate-[spin_4s_linear_infinite]" />
             <div className="absolute inset-0 blur-md bg-purple-400/40 rounded-full z-[-1]" />
          </div>
          <span className="font-bold text-xl tracking-wider text-white">AURA<span className="text-white/40 font-light">.AI</span></span>
        </div>
        <div className="text-sm font-medium text-white/40 uppercase tracking-widest hidden sm:block">
          Content Verification Suite
        </div>
      </nav>

      <div className="w-full max-w-7xl mx-auto space-y-16 flex-1 relative z-10">
        
        {/* Hero Header */}
        <AnimatedHero />

        {/* The Machine */}
        <FakeNewsDetector />
      </div>
      
      <footer className="mt-24 pb-8 text-center text-xs text-white/30 font-mono tracking-widest w-full z-10">
        &copy; {new Date().getFullYear()} AURA.AI SYSTEMS. DEMONSTRATION MODE.
      </footer>
    </main>
  );
}
