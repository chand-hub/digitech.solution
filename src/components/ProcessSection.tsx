import React from 'react';
import {
  MessageSquare,
  FileSpreadsheet,
  Palette,
  Code2,
  CheckCheck,
  Rocket,
} from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'DISCUSSION',
      summary: 'Understand business requirements and goals.',
      detail:
        'We start with a thorough discovery session to understand your business niche, target audience, brand aesthetic, and primary objectives.',
      icon: MessageSquare,
      color: '#D6B46A',
    },
    {
      step: '02',
      title: 'PLANNING',
      summary: 'Prepare website structure and functionality.',
      detail:
        'We outline the sitemap, wireframe key customer journeys, plan user navigation, and establish technical and content requirements.',
      icon: FileSpreadsheet,
      color: '#3185FF',
    },
    {
      step: '03',
      title: 'DESIGN',
      summary: 'Create a modern and professional design.',
      detail:
        'We craft high-fidelity interface designs tailored to your brand with clean typography, responsive layouts, and conversion-focused flows.',
      icon: Palette,
      color: '#D6B46A',
    },
    {
      step: '04',
      title: 'DEVELOPMENT',
      summary: 'Build the website and implement required features.',
      detail:
        'We build clean, fast, and secure code, integrating contact forms, WhatsApp actions, responsive layouts, and interactive media.',
      icon: Code2,
      color: '#3185FF',
    },
    {
      step: '05',
      title: 'TESTING',
      summary: 'Check responsiveness, navigation, forms and performance.',
      detail:
        'We rigorously test across mobile phones, tablets, browsers, test form submissions, verify loading speed, and optimize for accessibility.',
      icon: CheckCheck,
      color: '#D6B46A',
    },
    {
      step: '06',
      title: 'DELIVERY',
      summary: 'Deploy the approved website and provide project handover.',
      detail:
        'We deploy your website to production, connect your custom domain, set up hosting, and deliver all project credentials with ongoing support.',
      icon: Rocket,
      color: '#3185FF',
    },
  ];

  return (
    <section id="process" className="py-20 lg:py-28 relative bg-[#080B12] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16 lg:mb-20">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#D6B46A]">
            <span>Methodology</span>
            <span className="text-slate-600">·</span>
            <span className="text-[#B7C0CE]">Structured Delivery</span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight text-white tracking-tight">
            OUR WORK <span className="gold-gradient-text">PROCESS</span>
          </h2>

          <p className="text-base text-[#B7C0CE] leading-relaxed">
            A transparent six-stage roadmap from initial concept to your live, revenue-generating
            website.
          </p>
        </div>

        {/* 6-Step Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="relative p-7 rounded-2xl bg-[#0E1626] border border-slate-800/90 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/60 group flex flex-col justify-between"
              >
                {/* Step Pill & Step Number */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#101827] border border-slate-800"
                      style={{ color: item.color }}
                    >
                      STEP {item.step}
                    </span>
                    <div className="p-2.5 rounded-lg bg-[#101827] text-slate-400 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Summaries */}
                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-[#D6B46A] transition-colors tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm font-medium text-slate-300">{item.summary}</p>
                  </div>

                  <p className="text-xs text-[#B7C0CE] leading-relaxed pt-2 border-t border-slate-800/80">
                    {item.detail}
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
