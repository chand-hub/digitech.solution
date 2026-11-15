import React from 'react';
import {
  Layout,
  Smartphone,
  Compass,
  Briefcase,
  Sparkles,
  HeadphonesIcon,
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      number: '01',
      title: 'Modern Website Designs',
      description:
        'Clean aesthetics, intentional typography, and visual hierarchy crafted to elevate your business credibility and set you apart from competitors.',
      icon: Layout,
    },
    {
      number: '02',
      title: 'Mobile Responsive Development',
      description:
        'Fluid adaptation across smartphones, tablets, and desktop displays so every customer enjoys an effortless viewing experience on any device.',
      icon: Smartphone,
    },
    {
      number: '03',
      title: 'User-Friendly Navigation',
      description:
        'Clear layouts with intuitive menus and frictionless page architecture that make it easy for visitors to find services, pricing, and contact info.',
      icon: Compass,
    },
    {
      number: '04',
      title: 'Business-Focused Solutions',
      description:
        'Every website is engineered around genuine business goals — generating qualified client enquiries, receiving direct WhatsApp leads, and driving revenue.',
      icon: Briefcase,
    },
    {
      number: '05',
      title: 'Professional Presentation',
      description:
        'Polished branding, high-resolution imagery presentation, structured service breakdowns, and clear legal and contact details for maximum trust.',
      icon: Sparkles,
    },
    {
      number: '06',
      title: 'Dedicated Project Support',
      description:
        'Direct communication during development, rigorous multi-device testing, smooth deployment handover, and continuous maintenance assistance.',
      icon: HeadphonesIcon,
    },
  ];

  return (
    <section className="py-20 lg:py-28 relative bg-[#0B0F1A] border-y border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#D6B46A]">
            <span>Agency Values</span>
            <span className="text-slate-600">·</span>
            <span className="text-[#B7C0CE]">The DTS Difference</span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight text-white tracking-tight">
            WHY BUSINESSES CHOOSE{' '}
            <span className="gold-gradient-text">DIGI TECH SOLUTION</span>
          </h2>

          <p className="text-base text-[#B7C0CE] leading-relaxed">
            We focus on authentic craftsmanship, dependable communication, and real digital solutions
            tailored to your exact business sector.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className="p-7 rounded-2xl bg-[#0E1626] border border-slate-800/90 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/50 group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-[#101827] text-[#D6B46A] group-hover:bg-[#D6B46A]/10 transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xs text-slate-500 font-medium">
                      {reason.number}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white group-hover:text-[#D6B46A] transition-colors">
                    {reason.title}
                  </h3>

                  <p className="text-sm text-[#B7C0CE] leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
