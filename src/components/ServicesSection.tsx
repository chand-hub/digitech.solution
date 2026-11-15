import React, { useState } from 'react';
import {
  Globe,
  Hospital,
  Utensils,
  Heart,
  Zap,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  X,
  MessageCircle,
} from 'lucide-react';
import { SERVICES_LIST } from '../config/servicesConfig';
import { ServiceItem } from '../types';
import { getWhatsAppEnquiryUrl } from '../config/agencyConfig';

const iconMap = {
  Globe,
  Hospital,
  Utensils,
  Heart,
  Zap,
  RefreshCw,
};

interface ServicesSectionProps {
  onSelectServiceForQuote: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForQuote }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  return (
    <section id="services" className="py-20 lg:py-28 relative bg-[#0B0F1A] border-y border-slate-900">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#D6B46A]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#3185FF]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#D6B46A]">
            <span>Capabilities</span>
            <span className="text-slate-600">·</span>
            <span className="text-[#B7C0CE]">Full-Stack Web Solutions</span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-tight text-white tracking-tight">
            OUR <span className="gold-gradient-text">SERVICES</span>
          </h2>

          <p className="text-base text-[#B7C0CE] leading-relaxed">
            Tailored website design and development services engineered to empower local
            enterprises, healthcare providers, hospitality brands, and modern businesses.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES_LIST.map((service) => {
            const Icon = iconMap[service.iconName] || Globe;
            return (
              <div
                key={service.id}
                className="flex flex-col justify-between p-7 rounded-2xl bg-[#0E1626] border border-slate-800/90 hover:border-[#D6B46A]/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/60 group relative overflow-hidden"
              >
                {/* Subtle top border highlight on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D6B46A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="space-y-4">
                  {/* Service Number & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="p-3.5 rounded-xl bg-[#101827] border border-slate-800 text-[#D6B46A] group-hover:bg-[#D6B46A]/10 group-hover:text-[#F0DCAB] transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-sm text-slate-500 font-medium">
                      {service.number}
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-xl text-white group-hover:text-[#D6B46A] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-[#B7C0CE] leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>

                  {/* Key Highlights list */}
                  <div className="pt-2 border-t border-slate-800/60 space-y-1.5">
                    {service.deliverables.slice(0, 3).map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3185FF] shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D6B46A] hover:text-[#F0DCAB] transition-colors cursor-pointer group/btn"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>

                  <button
                    onClick={() => onSelectServiceForQuote(service.title)}
                    className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#0E1626] border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#D6B46A]/10 text-[#D6B46A]">
                  {React.createElement(iconMap[selectedService.iconName] || Globe, {
                    className: 'w-6 h-6',
                  })}
                </div>
                <div>
                  <div className="text-xs font-mono text-[#D6B46A]">{selectedService.number}</div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                    {selectedService.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#B7C0CE] leading-relaxed">
              {selectedService.fullDescription}
            </p>

            {/* Best For */}
            <div className="p-3.5 rounded-xl bg-[#101827] border border-slate-800 text-xs text-slate-300">
              <strong className="text-[#D6B46A] block mb-1 uppercase tracking-wider text-[10px]">
                Recommended For
              </strong>
              {selectedService.bestFor}
            </div>

            {/* Deliverables */}
            <div className="space-y-2.5">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                What's Included:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedService.deliverables.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 p-2 rounded-lg bg-[#080B12] border border-slate-800/80 text-xs text-slate-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#3185FF] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  const serviceName = selectedService.title;
                  setSelectedService(null);
                  onSelectServiceForQuote(serviceName);
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#080B12] bg-[#D6B46A] hover:bg-[#F0DCAB] transition-colors text-center cursor-pointer"
              >
                Request Free Quote For This Service
              </button>

              <a
                href={getWhatsAppEnquiryUrl({
                  websiteType: selectedService.title,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-xs font-semibold text-[#25D366] bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
