import React, { useState } from 'react';
import { ArrowRight, Sparkles, ExternalLink, ShieldCheck, Smartphone, Monitor } from 'lucide-react';
import { AGENCY_CONFIG } from '../config/agencyConfig';
import { PORTFOLIO_PROJECTS } from '../config/portfolioConfig';

interface HeroProps {
  onOpenQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuote }) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const categories = [
    {
      id: 'matrimonial',
      label: 'Matrimonial',
      subtitle: 'Matchmaking Portal',
      project: PORTFOLIO_PROJECTS[0],
      accent: '#D6B46A',
    },
    {
      id: 'healthcare',
      label: 'Healthcare',
      subtitle: 'Clinics & Doctors',
      project: PORTFOLIO_PROJECTS[1],
      accent: '#3185FF',
    },
    {
      id: 'restaurant',
      label: 'Restaurant',
      subtitle: 'Menu & Reservations',
      project: PORTFOLIO_PROJECTS[2],
      accent: '#D6B46A',
    },
  ];

  const currentCategory = categories[activeCategoryIndex];

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden"
    >
      {/* Background radial gradients for subtle luxury depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#3185FF]/10 via-[#D6B46A]/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-[#3185FF]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -right-48 w-96 h-96 bg-[#D6B46A]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Subtle tech grid background lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-7 text-left">
            {/* Agency Trust Kicker (Quiet unboxed typography with dot separator) */}
            <div className="flex items-center gap-2.5 text-xs font-semibold tracking-wider uppercase text-[#D6B46A]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#D6B46A]" />
              <span>DIGI TECH SOLUTION</span>
              <span className="text-slate-600">·</span>
              <span className="text-[#B7C0CE]">Your Digital Growth Partner</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.12] tracking-tight text-white max-w-2xl text-balance">
              YOUR BUSINESS DESERVES A{' '}
              <span className="gold-gradient-text">POWERFUL DIGITAL</span> PRESENCE.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#B7C0CE] leading-relaxed max-w-xl font-normal">
              We design and develop modern, responsive and professional websites that help
              businesses build credibility, reach more customers and grow online.
            </p>

            {/* Category Focus Bar - Interactive selector without pill clutter */}
            <div className="pt-1">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-2.5">
                Specialized Solutions For:
              </div>
              <div className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-[#101827] border border-slate-800 rounded-xl">
                {categories.map((cat, idx) => {
                  const isActive = activeCategoryIndex === idx;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryIndex(idx)}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-[#1E293B] text-white shadow-sm border border-slate-700/80'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                      }`}
                    >
                      <span className={isActive ? 'text-[#D6B46A] font-semibold' : ''}>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href="#portfolio"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg text-sm font-semibold uppercase tracking-wider text-[#080B12] bg-[#D6B46A] hover:bg-[#F0DCAB] transition-all duration-200 shadow-lg shadow-[#D6B46A]/20 hover:shadow-[#D6B46A]/40 active:scale-[0.98] text-center"
              >
                <span>Explore Our Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenQuote}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold text-white bg-[#101827] hover:bg-[#1E293B] border border-slate-700/80 transition-all duration-200 hover:border-slate-600 active:scale-[0.98] text-center cursor-pointer"
              >
                <span>Get a Free Consultation</span>
              </button>
            </div>

            {/* Real Agency Trust Points (No fake stats) */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#B7C0CE]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D6B46A]" />
                <span>100% Mobile Responsive</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#3185FF]" />
                <span>Direct WhatsApp Integration</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D6B46A]" />
                <span>Modern Clean Design</span>
              </div>
            </div>
          </div>

          {/* Right Column: Official Price-Free Promotional Poster Banner */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Back Glow */}
            <div className="absolute inset-0 bg-radial from-[#3185FF]/20 via-[#D6B46A]/10 to-transparent blur-2xl -z-10" />

            <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-none mx-auto">
              <div className="relative bg-[#0E1626] border border-[#D6B46A]/35 rounded-2xl p-2 sm:p-3 shadow-2xl shadow-black/80 transition-all duration-300 hover:border-[#D6B46A]/60">
                <button
                  type="button"
                  onClick={onOpenQuote}
                  className="block w-full overflow-hidden rounded-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D6B46A] cursor-pointer group"
                  aria-label="DIGI TECH SOLUTION Official Promotional Poster - Click for Free Quote"
                >
                  <img
                    src={AGENCY_CONFIG.promotionalPoster}
                    alt="DIGI TECH SOLUTION - Your Business Deserves A Professional Website"
                    className="w-full h-auto max-h-[420px] sm:max-h-[480px] lg:max-h-[540px] object-contain mx-auto rounded-xl transition-transform duration-500 group-hover:scale-[1.015]"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
