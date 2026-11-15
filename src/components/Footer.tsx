import React from 'react';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ArrowUp,
  Instagram,
  Facebook,
} from 'lucide-react';
import { AGENCY_CONFIG } from '../config/agencyConfig';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080B12] border-t border-slate-900 pt-16 pb-12 relative text-[#B7C0CE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <img
                src={AGENCY_CONFIG.monogramLogo}
                alt="DIGI TECH SOLUTION Monogram"
                className="w-10 h-10 object-contain rounded-md"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="font-display font-bold text-lg text-white tracking-tight">
                  DIGI TECH <span className="text-[#D6B46A]">SOLUTION</span>
                </span>
                <div className="text-xs text-[#D6B46A] font-medium tracking-wide">
                  {AGENCY_CONFIG.tagline}
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              A professional digital solutions agency helping local businesses, startups, hospitals,
              restaurants, matrimonial services and modern enterprises establish a powerful online
              presence.
            </p>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D6B46A] shrink-0" />
                <span>{AGENCY_CONFIG.businessLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#3185FF] shrink-0" />
                <span>{AGENCY_CONFIG.contactNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D6B46A] shrink-0" />
                <span>{AGENCY_CONFIG.emailAddress}</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#home" className="hover:text-[#D6B46A] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#D6B46A] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#D6B46A] transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-[#D6B46A] transition-colors">
                  Portfolio Showcase
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-[#D6B46A] transition-colors">
                  Work Process
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#D6B46A] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider">
              Specialized Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Website Development
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Hospital & Clinic Websites
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Restaurant Websites
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Matrimonial Websites
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Landing Page Development
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  Website Redesign
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media & Direct Action */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider">
              Connect With Us
            </h4>
            <div className="flex items-center gap-2">
              <a
                href={AGENCY_CONFIG.socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#0E1626] border border-slate-800 text-[#25D366] hover:bg-[#25D366]/10 hover:border-[#25D366]/40 transition-colors"
                title="WhatsApp"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={AGENCY_CONFIG.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#0E1626] border border-slate-800 text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/40 transition-colors"
                title="Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={AGENCY_CONFIG.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#0E1626] border border-slate-800 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/40 transition-colors"
                title="Facebook"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>

            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center justify-center w-full py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#080B12] bg-[#D6B46A] hover:bg-[#F0DCAB] transition-colors"
              >
                Get Free Quote
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© 2026 DIGI TECH SOLUTION. All Rights Reserved.</div>

          <div className="flex items-center gap-6">
            <span>Darbhanga, Bihar, India</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
