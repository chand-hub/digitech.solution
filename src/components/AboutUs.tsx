import React from 'react';
import { Palette, Smartphone, TrendingUp, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { AGENCY_CONFIG } from '../config/agencyConfig';

interface AboutUsProps {
  onOpenQuote: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onOpenQuote }) => {
  const valueProps = [
    {
      title: 'Modern & Professional Design',
      description:
        'Aesthetic, clean interfaces crafted specifically for your industry to make an unforgettable first impression and build long-term trust.',
      icon: Palette,
      color: '#D6B46A',
    },
    {
      title: 'Mobile-Friendly Experiences',
      description:
        'Flawless responsive performance across every smartphone, tablet, and desktop display, ensuring seamless browsing for all visitors.',
      icon: Smartphone,
      color: '#3185FF',
    },
    {
      title: 'Business-Focused Solutions',
      description:
        'Strategically structured navigation, intuitive inquiry flows, and direct WhatsApp / call touchpoints designed to convert visitors into inquiries.',
      icon: TrendingUp,
      color: '#D6B46A',
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 relative bg-[#080B12] overflow-hidden">
      {/* Background structural accent */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#3185FF]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Brand Story & Mission */}
          <div className="lg:col-span-6 space-y-6">
            {/* Section Eyebrow */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#D6B46A]">
              <span>About Us</span>
              <span className="text-slate-600">·</span>
              <span className="text-[#B7C0CE]">Agency Overview</span>
            </div>

            {/* Section Heading */}
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight text-white tracking-tight">
              WE TURN BUSINESS IDEAS INTO{' '}
              <span className="gold-gradient-text">DIGITAL EXPERIENCES.</span>
            </h2>

            {/* Description Text */}
            <div className="space-y-4 text-base text-[#B7C0CE] leading-relaxed">
              <p>
                <strong className="text-white font-semibold">DIGI TECH SOLUTION</strong> is a
                digital solutions agency focused on creating professional websites and digital
                experiences for modern businesses.
              </p>
              <p>
                Our mission is to help businesses establish their online identity through attractive
                designs, user-friendly functionality and reliable digital solutions.
              </p>
            </div>

            {/* Location & Service Scope (Authentic, no fake stats) */}
            <div className="p-4 rounded-xl bg-[#0E1626] border border-slate-800 flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-[#D6B46A]/10 text-[#D6B46A] shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-xs text-[#B7C0CE] space-y-1">
                <div className="font-semibold text-white text-sm">
                  Based in {AGENCY_CONFIG.businessLocation}
                </div>
                <div>
                  Partnering with local clinics, restaurants, matrimonial bureaus, startups, and
                  commercial enterprises across Bihar and all over India.
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenQuote}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#D6B46A] hover:text-[#F0DCAB] transition-colors cursor-pointer group"
              >
                <span>Discuss your business requirements</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Column: Three Core Value Propositions */}
          <div className="lg:col-span-6 space-y-4">
            {valueProps.map((prop, idx) => {
              const Icon = prop.icon;
              return (
                <div
                  key={prop.title}
                  className="p-6 rounded-2xl bg-[#0E1626] border border-slate-800/90 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/50 group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="p-3 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${prop.color}15`,
                        color: prop.color,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500">0{idx + 1}</span>
                        <h3 className="font-display font-bold text-lg text-white group-hover:text-[#D6B46A] transition-colors">
                          {prop.title}
                        </h3>
                      </div>
                      <p className="text-sm text-[#B7C0CE] leading-relaxed">
                        {prop.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
