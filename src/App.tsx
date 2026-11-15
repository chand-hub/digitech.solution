/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutUs } from './components/AboutUs';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ProcessSection } from './components/ProcessSection';
import { CallToAction } from './components/CallToAction';
import { ContactSection } from './components/ContactSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { QuoteModal } from './components/QuoteModal';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppEnquiryUrl, AGENCY_CONFIG } from './config/agencyConfig';

export default function App() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [preSelectedService, setPreSelectedService] = useState<string | undefined>(undefined);

  const handleOpenQuote = (serviceName?: string) => {
    setPreSelectedService(serviceName);
    setIsQuoteModalOpen(true);
  };

  const handleSelectServiceForQuote = (serviceName: string) => {
    // Scroll smoothly to contact section with service preselected
    setPreSelectedService(serviceName);
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsQuoteModalOpen(true);
    }
  };

  const handleStartProject = () => {
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      setIsQuoteModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B12] text-white flex flex-col selection:bg-[#D6B46A]/30 selection:text-[#D6B46A]">
      {/* Sticky Top Navigation */}
      <Navbar onOpenQuote={() => handleOpenQuote()} />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onOpenQuote={() => handleOpenQuote()} />

        {/* About Us Section */}
        <AboutUs onOpenQuote={() => handleOpenQuote()} />

        {/* Our Services Section */}
        <ServicesSection onSelectServiceForQuote={handleSelectServiceForQuote} />

        {/* Featured Portfolio Section (Most Important) */}
        <PortfolioSection />

        {/* Why Choose Us Section */}
        <WhyChooseUs />

        {/* 6-Step Work Process Timeline */}
        <ProcessSection />

        {/* Mid-Funnel Call to Action */}
        <CallToAction onStartProject={handleStartProject} />

        {/* Interactive Contact & Enquiry Form Section */}
        <ContactSection initialService={preSelectedService} />

        {/* 7-Question FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Free Quote & Consultation Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        preSelectedService={preSelectedService}
      />

      {/* Floating Instant WhatsApp Button for rapid customer inquiries */}
      <aside
        aria-label="Direct WhatsApp Enquiry"
        className="fixed bottom-5 right-5 z-40 group flex items-center gap-2"
      >
        <span className="hidden sm:inline-block px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0E1626] border border-slate-700 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Chat on WhatsApp
        </span>
        <a
          href={getWhatsAppEnquiryUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center shadow-[#25D366]/40"
          title={`Chat with ${AGENCY_CONFIG.businessName} on WhatsApp`}
        >
          <MessageCircle className="w-6 h-6 fill-white text-white" />
        </a>
      </aside>
    </div>
  );
}
