
export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  status: 'Published Demo' | 'Concept Project / Demo';
  description: string;
  features: string[];
  websiteUrl: string;
  buttonLabel: string;
  screenshotDesktop?: string;
  screenshotMobile?: string;
  colorAccent: string;
  industry: 'matrimonial' | 'healthcare' | 'restaurant';
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  deliverables: string[];
  bestFor: string;
  iconName: 'Globe' | 'Hospital' | 'Utensils' | 'Heart' | 'Zap' | 'RefreshCw';
}

export interface ContactFormData {
  fullName: string;
  businessName: string;
  phoneNumber: string;
  whatsAppNumber?: string;
  emailAddress: string;
  businessLocation: string;
  websiteType: string;
  hasExistingWebsite: 'Yes' | 'No';
  existingWebsiteUrl?: string;
  requiredFeatures: string[];
  projectBudget: string;
  additionalRequirements: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

