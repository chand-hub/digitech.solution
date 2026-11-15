import { ProjectItem } from '../types';

/**
 * =========================================================================
 * FEATURED PORTFOLIO CONFIGURATION - EDITABLE URLS & PROJECT SPECIFICATIONS
 * =========================================================================
 * All project URLs, categories, descriptions, and feature lists can be easily
 * updated directly in this configuration array.
 * Note: All projects are clearly identified as Published Demo or Concept Demos.
 */

export const PORTFOLIO_PROJECTS: ProjectItem[] = [
  {
    id: 'matrimonial-website',
    title: 'Anmol Rista Matrimonial Platform',
    category: 'Matrimonial & Matchmaking',
    status: 'Published Demo',
    description:
      'A modern matrimonial website designed to present matchmaking services, showcase profiles and help families connect through an organized digital platform.',
    features: [
      'Professional homepage',
      'Profile presentation',
      'About section',
      'Contact and enquiry section',
      'Responsive design',
    ],
    websiteUrl: 'https://anmolrista.ai.studio/',
    buttonLabel: 'VIEW LIVE WEBSITE',
    screenshotDesktop: '/assets/aistudio/image_49a92eb7.png',
    screenshotMobile: '/assets/aistudio/image_4144f575.png',
    colorAccent: '#D6B46A',
    industry: 'matrimonial',
  },
  {
    id: 'hospital-website',
    title: 'Darbhanga 24 Clinics Healthcare Portal',
    category: 'Healthcare & Medical',
    status: 'Concept Project / Demo',
    description:
      'A professional healthcare website concept designed to showcase hospital services, doctors, facilities and appointment information.',
    features: [
      'Hospital homepage',
      'Doctor profiles',
      'Medical departments',
      'Healthcare services',
      'Appointment interface',
      'Contact information',
      'Responsive design',
    ],
    websiteUrl:
      'https://aistudio.google.com/apps/0c89d8da-05fa-4c49-b35a-46b148dba9ae?showAssistant=true&showPreview=true',
    buttonLabel: 'VIEW LIVE DEMO',
    screenshotDesktop: '/assets/aistudio/image_aa6a4e85.png',
    screenshotMobile: '/assets/aistudio/image_aa6a4e85.png',
    colorAccent: '#3185FF',
    industry: 'healthcare',
  },
  {
    id: 'restaurant-website',
    title: 'Hotel Madhuras Dining & Hospitality',
    category: 'Food & Hospitality',
    status: 'Concept Project / Demo',
    description:
      'A modern restaurant website concept designed to showcase food menus, restaurant atmosphere, services and reservation information.',
    features: [
      'Restaurant homepage',
      'Food menu',
      'Food gallery',
      'Reservation interface',
      'Location and contact section',
      'Responsive design',
    ],
    websiteUrl:
      'https://lovable.dev/projects/04e2d949-3155-4fc4-a9a8-a0051d2c99de?preview-path=%2F%23home',
    buttonLabel: 'VIEW LIVE DEMO',
    screenshotDesktop: '/assets/aistudio/image_9bd10d05.png',
    screenshotMobile: '/assets/aistudio/image_9bd10d05.png',
    colorAccent: '#D6B46A',
    industry: 'restaurant',
  },
];
