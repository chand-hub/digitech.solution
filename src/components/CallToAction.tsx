import React from 'react';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { AGENCY_CONFIG, getWhatsAppEnquiryUrl } from '../config/agencyConfig';

interface CallToActionProps {
  onStartProject: () => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({ onStartProject }) => {
  return (
    <section className="py-20 lg:py-28 relative bg-[#0B0F1A] border-y border-slate-900 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#3185FF]/10 via-[#D6B46A]/15 to-[#3185FF]/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101827] border border-slate-800 text-xs font-semibold text-[#D6B46A] tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Start Your Digital Journey Today</span>
        </div>

        <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight text-white tracking-tight max-w-3xl mx-auto text-balance">
          READY TO TAKE YOUR BUSINESS <span className="gold-gradient-text">ONLINE?</span>
        </h2>

        <p className="text-base sm:text-lg text-[#B7C0CE] max-w-2xl mx-auto leading-relaxed">
          Let's create a professional website that makes your business stand out.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onStartProject}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-[#080B12] bg-[#D6B46A] hover:bg-[#F0DCAB] transition-all duration-200 shadow-xl shadow-[#D6B46A]/25 hover:shadow-[#D6B46A]/40 active:scale-[0.98] cursor-pointer"
          >
            <span>Start Your Project</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={getWhatsAppEnquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold text-white bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 transition-all duration-200 hover:border-[#25D366] active:scale-[0.98]"
          >
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            <span>Contact Us on WhatsApp</span>
          </a>
        </div>

        <div className="pt-4 text-xs text-slate-500">
          Fast response within working hours · Free consultation & project estimation
        </div>
      </div>
    </section>
  );
};
