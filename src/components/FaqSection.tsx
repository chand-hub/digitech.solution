import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { FAQ_LIST } from '../config/faqConfig';
import { getWhatsAppEnquiryUrl } from '../config/agencyConfig';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 lg:py-28 relative bg-[#0B0F1A] border-t border-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#D6B46A]">
            <span>Common Queries</span>
            <span className="text-slate-600">·</span>
            <span className="text-[#B7C0CE]">Clear Answers</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight text-white tracking-tight">
            FREQUENTLY ASKED <span className="gold-gradient-text">QUESTIONS</span>
          </h2>

          <p className="text-base text-[#B7C0CE] leading-relaxed">
            Everything you need to know about partnering with DIGI TECH SOLUTION.
          </p>
        </div>

        {/* 7 Accordion Items */}
        <div className="space-y-3">
          {FAQ_LIST.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl bg-[#0E1626] border border-slate-800/90 overflow-hidden transition-colors duration-200"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer transition-colors hover:bg-slate-800/40 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D6B46A]"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-semibold text-base sm:text-lg text-white pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`p-1.5 rounded-lg bg-[#101827] text-[#D6B46A] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-[#D6B46A]/20' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-[#B7C0CE] leading-relaxed border-t border-slate-800/60 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Extra Question Assistance */}
        <div className="mt-12 p-6 rounded-2xl bg-[#0E1626] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#D6B46A]/10 text-[#D6B46A]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Have a different question?</div>
              <div className="text-xs text-slate-400">
                Reach out to our founders directly for prompt assistance.
              </div>
            </div>
          </div>

          <a
            href={getWhatsAppEnquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-[#25D366] bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-colors whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Ask Us Directly on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
