/**
 * DIGI TECH SOLUTION - Global Agency Configuration
 * All contact information, placeholders, and agency metadata are centralized here.
 */

export const AGENCY_CONFIG = {
  businessName: 'DIGI TECH SOLUTION',
  tagline: 'Your Digital Growth Partner',
  category: 'Website Design & Development Agency',
  
  // Contact & Location Details (Configurable)
  whatsappNumber: '7319785754',
  whatsappCountryCode: '91',
  contactNumber: '+91 7319785754',
  emailAddress: 'mdc476728@gmail.com',
  businessLocation: 'Darbhanga, Bihar, India',
  pinCode: '846004',
  workingHours: 'Monday – Saturday: 9:00 AM – 8:00 PM IST',
  
  // Brand Assets
  monogramLogo: '/assets/aistudio/image_87d908a9.png',
  fullLogo: '/assets/aistudio/image_c0d6f464.png',
  promotionalPoster: '/assets/dts-promotional-poster.jpg',

  // Social Links
  socialLinks: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    whatsapp: 'https://wa.me/917319785754',
  },

  // Navigation Links
  navLinks: [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ],
};

/**
 * Generates a direct WhatsApp link with a pre-filled enquiry message
 */
export function getWhatsAppEnquiryUrl(details?: {
  name?: string;
  business?: string;
  websiteType?: string;
  requirements?: string;
}): string {
  const phone = `${AGENCY_CONFIG.whatsappCountryCode}${AGENCY_CONFIG.whatsappNumber}`;
  
  let message = `Hello ${AGENCY_CONFIG.businessName}! I am interested in website design and development services for my business.`;
  
  if (details?.name) {
    message += `\n\nName: ${details.name}`;
  }
  if (details?.business) {
    message += `\nBusiness: ${details.business}`;
  }
  if (details?.websiteType) {
    message += `\nWebsite Type: ${details.websiteType}`;
  }
  if (details?.requirements) {
    message += `\nProject Details: ${details.requirements}`;
  }
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
