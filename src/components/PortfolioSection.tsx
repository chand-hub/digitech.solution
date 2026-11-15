import React, { useState } from 'react';
import {
  ExternalLink,
  CheckCircle2,
  Monitor,
  Smartphone,
  ArrowUpRight,
  Sparkles,
  Eye,
  Layers,
} from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../config/portfolioConfig';

export const PortfolioSection: React.FC = () => {
  const [deviceViews, setDeviceViews] = useState<Record<string, 'dual' | 'desktop' | 'mobile'>>({
    'matrimonial-website': 'dual',
    'hospital-website': 'dual',
    'restaurant-website': 'dual',
  });

  const [activePreviewModal, setActivePreviewModal] = useState<{
    title: string;
    image: string;
    type: 'desktop' | 'mobile';
  } | null>(null);

  const toggleDeviceView = (projectId: string, view: 'dual' | 'desktop' | 'mobile') => {
    setDeviceViews((prev) => ({
      ...prev,
      [projectId]: view,
    }));
  };

  return (
    <section id="portfolio" className="py-20 lg:py-32 relative bg-[#080B12]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#D6B46A]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-2/3 -right-32 w-96 h-96 bg-[#3185FF]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16 lg:mb-20">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#D6B46A]">
            <span>Portfolio Showcase</span>
            <span className="text-slate-600">·</span>
            <span className="text-[#B7C0CE]">Real Concepts & Working Demos</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight text-white tracking-tight">
            OUR <span className="gold-gradient-text">SELECTED WORK</span>
          </h2>

          <p className="text-base text-[#B7C0CE] leading-relaxed">
            Explore some of our website design and development projects.
          </p>

          <div className="pt-2 text-xs text-slate-500">
            All showcase projects below are published demos or interactive concepts designed to
            demonstrate real-world UX and features.
          </div>
        </div>

        {/* 3 Featured Projects (Alternating Staggered Layout for visual rhythm) */}
        <div className="space-y-16 lg:space-y-24">
          {PORTFOLIO_PROJECTS.map((project, index) => {
            const currentView = deviceViews[project.id] || 'dual';
            const isEven = index % 2 === 1;
            const isMatrimonial = project.id === 'matrimonial-website';

            return (
              <div
                key={project.id}
                className="relative p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#0E1626] border border-slate-800/90 hover:border-slate-700 transition-all duration-300 shadow-2xl shadow-black/80 group"
              >
                {/* Project Number Accent */}
                <div className="absolute top-6 right-6 lg:top-8 lg:right-8 font-mono text-xs sm:text-sm text-slate-600 font-semibold tracking-wider">
                  PROJECT 0{index + 1}
                </div>

                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                    isEven ? 'lg:grid-flow-dense' : ''
                  }`}
                >
                  {/* Column 1: Project Information & Details */}
                  <div className={`lg:col-span-5 space-y-6 ${isEven ? 'lg:col-start-8' : ''}`}>
                    {/* Category & Status Badges */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D6B46A]">
                        <span>{project.category}</span>
                      </div>

                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium bg-[#101827] border border-slate-800 text-slate-300">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            project.status === 'Published Demo' ? 'bg-[#D6B46A]' : 'bg-[#3185FF]'
                          }`}
                        />
                        <span>{project.status}</span>
                      </div>
                    </div>

                    {/* Project Title */}
                    <h3 className="font-display font-bold text-2xl sm:text-3xl text-white group-hover:text-[#D6B46A] transition-colors">
                      {project.title}
                    </h3>

                    {/* Project Description */}
                    <p className="text-sm sm:text-base text-[#B7C0CE] leading-relaxed">
                      {project.description}
                    </p>

                    {/* Dedicated Responsive Showcase Block for Matrimonial (Requirement Part 1) */}
                    {isMatrimonial && (
                      <div className="p-4 rounded-xl bg-[#101827] border border-[#D6B46A]/30 space-y-2">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#D6B46A]" />
                          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                            DESKTOP & MOBILE RESPONSIVE DESIGN
                          </h4>
                        </div>
                        <p className="text-xs text-[#B7C0CE] leading-relaxed">
                          A modern matrimonial platform designed to deliver a smooth experience
                          across desktop, tablet and smartphone devices.
                        </p>
                      </div>
                    )}

                    {/* Features Checklist */}
                    <div className="space-y-2 pt-1 border-t border-slate-800/80">
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Included Features:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                        {project.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#3185FF] shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button - Opens corresponding actual website in new tab */}
                    <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <a
                        href={project.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#080B12] bg-[#D6B46A] hover:bg-[#F0DCAB] transition-all duration-200 shadow-md shadow-[#D6B46A]/20 hover:shadow-[#D6B46A]/40 active:scale-[0.98] text-center"
                      >
                        <span>{project.buttonLabel}</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>

                      <span className="text-[11px] text-slate-500 text-center sm:text-left">
                        Opens live project in new tab
                      </span>
                    </div>
                  </div>

                  {/* Column 2: Realistic Mockup Display (Laptop + Smartphone) */}
                  <div className={`lg:col-span-7 ${isEven ? 'lg:col-start-1' : ''}`}>
                    <div className="relative">
                      {/* Interactive View Selector for Mockup */}
                      <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                        <span className="font-mono text-[11px] text-slate-500 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-[#D6B46A]" />
                          <span>DEVICE PREVIEW GALLERY</span>
                        </span>
                        <div className="inline-flex items-center gap-1 p-0.5 bg-[#080B12] border border-slate-800 rounded-lg">
                          <button
                            onClick={() => toggleDeviceView(project.id, 'dual')}
                            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                              currentView === 'dual'
                                ? 'bg-slate-800 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                            title="Dual Laptop & Phone View"
                          >
                            Dual View
                          </button>
                          <button
                            onClick={() => toggleDeviceView(project.id, 'desktop')}
                            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                              currentView === 'desktop'
                                ? 'bg-slate-800 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                            title="Desktop Laptop View"
                          >
                            Laptop
                          </button>
                          <button
                            onClick={() => toggleDeviceView(project.id, 'mobile')}
                            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                              currentView === 'mobile'
                                ? 'bg-slate-800 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                            title="Smartphone Mobile View"
                          >
                            Mobile
                          </button>
                        </div>
                      </div>

                      {/* Mockup Canvas */}
                      <div className="relative bg-[#080B12] border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-hidden">
                        {/* Background radial highlight */}
                        <div
                          className="absolute inset-0 opacity-10 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at 50% 50%, ${project.colorAccent}, transparent 70%)`,
                          }}
                        />

                        {/* PROFESSIONAL LAPTOP MOCKUP */}
                        {(currentView === 'dual' || currentView === 'desktop') && (
                          <div className="relative rounded-xl border border-slate-700/80 bg-[#101827] shadow-2xl transition-all duration-300">
                            {/* Browser Bar */}
                            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-slate-400 text-xs">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                              </div>
                              <div className="flex items-center gap-2 bg-[#080B12] px-3 py-1 rounded text-[11px] font-mono text-slate-300 border border-slate-800 max-w-[260px] truncate">
                                <Monitor className="w-3 h-3 text-[#D6B46A]" />
                                <span className="truncate">{project.websiteUrl}</span>
                              </div>
                              <a
                                href={project.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors"
                                title="Open Live Site"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>

                            {/* Laptop Viewport Screen */}
                            <div className="aspect-[16/10] overflow-hidden bg-slate-950 relative group/screen">
                              <img
                                src={project.screenshotDesktop}
                                alt={`${project.title} Desktop Screenshot`}
                                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/screen:scale-102"
                                referrerPolicy="no-referrer"
                              />

                              {/* Hover Quick Action */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/screen:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 p-4">
                                <a
                                  href={project.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-[#080B12] bg-[#D6B46A] hover:bg-white transition-colors shadow-lg"
                                >
                                  <span>{project.buttonLabel}</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  onClick={() =>
                                    setActivePreviewModal({
                                      title: `${project.title} (Desktop)`,
                                      image: project.screenshotDesktop || '',
                                      type: 'desktop',
                                    })
                                  }
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Expand View</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* REALISTIC SMARTPHONE MOCKUP (Using uploaded mobile screenshot) */}
                        {(currentView === 'dual' || currentView === 'mobile') && (
                          <div
                            className={`${
                              currentView === 'dual'
                                ? 'absolute -bottom-6 right-2 sm:right-6 w-36 sm:w-44 z-20 shadow-2xl shadow-black drop-shadow-2xl'
                                : 'mx-auto w-52 sm:w-60 shadow-2xl'
                            } bg-[#080B12] border-2 border-slate-700 rounded-3xl p-1.5 transition-transform duration-300 hover:scale-105`}
                          >
                            {/* Phone Speaker Notch / Dynamic Island */}
                            <div className="w-10 h-1.5 bg-slate-800 rounded-full mx-auto my-1" />

                            {/* Phone Screen: Preserving original screenshot without distortion */}
                            <div className="aspect-[9/18] rounded-2xl overflow-hidden bg-slate-900 relative group/phone">
                              <img
                                src={project.screenshotMobile}
                                alt={`${project.title} Mobile Screenshot Preview`}
                                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/phone:scale-102"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                              <div className="absolute bottom-2 inset-x-2 text-center flex items-center justify-center gap-1">
                                <span className="text-[8px] font-semibold text-white bg-black/80 px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-wider">
                                  Mobile Interface
                                </span>
                              </div>

                              {/* Hover Quick View Button */}
                              <button
                                onClick={() =>
                                  setActivePreviewModal({
                                    title: `${project.title} (Mobile UI)`,
                                    image: project.screenshotMobile || '',
                                    type: 'mobile',
                                  })
                                }
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover/phone:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                              >
                                <span className="px-2.5 py-1 rounded bg-[#080B12]/90 border border-slate-700 text-[10px] text-white font-medium flex items-center gap-1">
                                  <Eye className="w-3 h-3 text-[#D6B46A]" />
                                  <span>View Screenshot</span>
                                </span>
                              </button>
                            </div>

                            {/* Phone Bottom Pill */}
                            <div className="w-8 h-1 bg-slate-700 rounded-full mx-auto my-1" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded Screenshot Inspection Modal */}
      {activePreviewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActivePreviewModal(null)}
        >
          <div
            className={`relative bg-[#0E1626] border border-slate-700 rounded-2xl p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${
              activePreviewModal.type === 'mobile' ? 'max-w-md' : 'max-w-4xl w-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="font-display font-bold text-sm sm:text-base text-white">
                {activePreviewModal.title}
              </div>
              <button
                onClick={() => setActivePreviewModal(null)}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
              <img
                src={activePreviewModal.image}
                alt={activePreviewModal.title}
                className="w-full h-auto max-h-[75vh] object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="pt-3 text-center">
              <a
                href="https://anmolrista.ai.studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D6B46A] hover:underline"
              >
                <span>Visit Live Matrimonial Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
