import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, MessageCircle } from 'lucide-react';
import { AGENCY_CONFIG } from '../config/agencyConfig';

interface NavbarProps {
  onOpenQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuote }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#080B12]/95 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-lg shadow-black/40'
            : 'bg-[#080B12]/60 backdrop-blur-xs border-b border-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            {/* Zone 1: Brand Wordmark & Monogram */}
            <a
              href="#home"
              className="flex items-center gap-3 shrink-0 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D6B46A] rounded-lg"
              aria-label="DIGI TECH SOLUTION Home"
            >
              <img
                src={AGENCY_CONFIG.monogramLogo}
                alt="DIGI TECH SOLUTION Monogram"
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-md transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white whitespace-nowrap leading-tight">
                  DIGI TECH <span className="text-[#D6B46A]">SOLUTION</span>
                </span>
                <span className="text-[10px] text-[#B7C0CE] tracking-wider uppercase font-medium">
                  {AGENCY_CONFIG.tagline}
                </span>
              </div>
            </a>

            {/* Zone 2: Navigation Links (Single-Line, no pills) */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#B7C0CE]">
              {AGENCY_CONFIG.navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="whitespace-nowrap transition-colors duration-200 hover:text-[#D6B46A] relative py-1 focus-visible:outline-hidden focus-visible:text-[#D6B46A]"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Zone 3: Primary Action */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <a
                href={AGENCY_CONFIG.socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-[#B7C0CE] hover:text-[#25D366] transition-colors rounded-lg hover:bg-slate-800/60"
                title="Chat on WhatsApp"
                aria-label="Direct WhatsApp Chat"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <button
                onClick={onOpenQuote}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#080B12] bg-[#D6B46A] hover:bg-[#F0DCAB] transition-all duration-200 shadow-sm shadow-[#D6B46A]/20 hover:shadow-[#D6B46A]/40 active:scale-[0.98] whitespace-nowrap cursor-pointer"
              >
                <span>Get a Free Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={onOpenQuote}
                className="sm:hidden px-3 py-1.5 text-xs font-semibold text-[#080B12] bg-[#D6B46A] rounded-md whitespace-nowrap"
              >
                Free Quote
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-[#B7C0CE] hover:text-white hover:bg-slate-800/80 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D6B46A]"
                aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeMenu}
          />

          {/* Drawer Content */}
          <div className="fixed top-[65px] right-0 bottom-0 w-full max-w-xs bg-[#0E1626] border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <img
                  src={AGENCY_CONFIG.monogramLogo}
                  alt="DTS Logo"
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <div className="font-display font-bold text-sm text-white">
                    DIGI TECH <span className="text-[#D6B46A]">SOLUTION</span>
                  </div>
                  <div className="text-[10px] text-[#B7C0CE]">
                    {AGENCY_CONFIG.tagline}
                  </div>
                </div>
              </div>

              <nav className="flex flex-col space-y-3">
                {AGENCY_CONFIG.navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={closeMenu}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-[#D6B46A] hover:bg-slate-800/60 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-800 space-y-3">
              <button
                onClick={() => {
                  closeMenu();
                  onOpenQuote();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#080B12] bg-[#D6B46A] hover:bg-[#F0DCAB] transition-colors"
              >
                <span>Get a Free Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={AGENCY_CONFIG.socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-medium text-[#25D366] bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <div className="text-center text-[11px] text-slate-500 pt-2">
                Darbhanga, Bihar • {AGENCY_CONFIG.contactNumber}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
