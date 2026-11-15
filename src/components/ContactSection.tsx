import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldAlert,
  Globe,
  Settings,
  RefreshCw,
  Edit3,
} from 'lucide-react';
import { AGENCY_CONFIG } from '../config/agencyConfig';
import { ContactFormData } from '../types';
import { getJsonSafely, postJsonSafely } from '../utils/apiClient';

interface ContactSectionProps {
  initialService?: string;
}

const WEBSITE_TYPES = [
  'Hospital / Clinic Website',
  'Restaurant Website',
  'Matrimonial Website',
  'Business Website',
  'E-commerce Website',
  'Landing Page',
  'Portfolio Website',
  'Other',
];

const AVAILABLE_FEATURES = [
  'Contact Form',
  'WhatsApp Integration',
  'Google Maps Integration',
  'Appointment Booking',
  'Online Payment',
  'Admin Dashboard',
  'Mobile Responsive Design',
  'Other',
];

const BUDGET_OPTIONS = [
  'Below ₹5,000',
  '₹5,000–₹10,000',
  '₹10,000–₹20,000',
  '₹20,000–₹50,000',
  'Above ₹50,000',
  'Need Consultation',
];

export const ContactSection: React.FC<ContactSectionProps> = ({ initialService }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    businessName: '',
    phoneNumber: '',
    whatsAppNumber: '',
    emailAddress: '',
    businessLocation: '',
    websiteType: initialService || 'Business Website',
    hasExistingWebsite: 'No',
    existingWebsiteUrl: '',
    requiredFeatures: ['Contact Form', 'WhatsApp Integration', 'Mobile Responsive Design'],
    projectBudget: '₹10,000–₹20,000',
    additionalRequirements: '',
  });

  const [botHoneypot, setBotHoneypot] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [serverEmailStatus, setServerEmailStatus] = useState<{
    configured: boolean;
    provider: string;
    targetEmail: string;
    hasApiKey: boolean;
  } | null>(null);

  const [submissionStatus, setSubmissionStatus] = useState<{
    success: boolean;
    emailSent: boolean;
    referenceId: string;
    recipientEmail: string;
    message: string;
    error?: string;
    details?: string;
  } | null>(null);

  // Check server email status on mount
  const checkEmailStatus = async () => {
    const res = await getJsonSafely<{
      configured: boolean;
      provider: string;
      targetEmail: string;
      hasApiKey: boolean;
    }>('/api/email-status');
    if (res.ok && res.data) {
      setServerEmailStatus(res.data);
    }
  };

  useEffect(() => {
    checkEmailStatus();
  }, []);

  // Update website type if passed from props
  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, websiteType: initialService }));
    }
  }, [initialService]);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full name (at least 2 characters).';
    }

    if (!formData.businessName.trim() || formData.businessName.trim().length < 2) {
      errs.businessName = 'Please enter your business or company name.';
    }

    const cleanPhone = formData.phoneNumber.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phoneNumber = 'Please enter a valid 10-digit mobile number.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.emailAddress.trim() || !emailRegex.test(formData.emailAddress.trim())) {
      errs.emailAddress = 'Please enter a valid email address.';
    }

    if (!formData.businessLocation.trim() || formData.businessLocation.trim().length < 2) {
      errs.businessLocation = 'Please enter your business city / location (e.g. Darbhanga, Bihar).';
    }

    if (!formData.websiteType) {
      errs.websiteType = 'Please select a website type.';
    }

    if (!formData.projectBudget) {
      errs.projectBudget = 'Please select your estimated budget range.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => {
      const exists = prev.requiredFeatures.includes(feature);
      const updated = exists
        ? prev.requiredFeatures.filter((f) => f !== feature)
        : [...prev.requiredFeatures, feature];
      return { ...prev, requiredFeatures: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !validate()) return;

    setIsSubmitting(true);
    const referenceId = `DTS-${Date.now().toString(36).toUpperCase()}`;

    try {
      const apiRes = await postJsonSafely<{
        success?: boolean;
        emailSent?: boolean;
        recipientEmail?: string;
        message?: string;
        error?: string;
        details?: string;
      }>('/api/contact', {
        ...formData,
        requestType: 'enquiry',
        referenceId,
        botHoneypot,
        submittedAt: new Date().toISOString(),
      });

      // Store in browser local backup storage
      try {
        const existingSubmissions = JSON.parse(localStorage.getItem('dts_enquiries') || '[]');
        existingSubmissions.push({
          ...formData,
          referenceId,
          submittedAt: new Date().toISOString(),
        });
        localStorage.setItem('dts_enquiries', JSON.stringify(existingSubmissions));
      } catch {
        // Ignore storage quota issues
      }

      const result = apiRes.data;

      if (apiRes.ok && result?.success && result?.emailSent) {
        setSubmissionStatus({
          success: true,
          emailSent: true,
          referenceId,
          recipientEmail: result.recipientEmail || 'mdc476728@gmail.com',
          message:
            'Your enquiry has been successfully delivered and an automated notification email was dispatched to official Gmail.',
        });
      } else if (result?.error === 'RESEND_API_KEY_NOT_CONFIGURED') {
        setSubmissionStatus({
          success: false,
          emailSent: false,
          error: 'RESEND_API_KEY_NOT_CONFIGURED',
          referenceId,
          recipientEmail: result.recipientEmail || 'mdc476728@gmail.com',
          message:
            'Enquiry recorded in database. However, RESEND_API_KEY is not yet configured in server environment (.env). Email notification could not be delivered to your Gmail inbox.',
          details: result.details,
        });
      } else {
        setSubmissionStatus({
          success: false,
          emailSent: false,
          error: result?.error || apiRes.error || 'EMAIL_DELIVERY_FAILED',
          referenceId,
          recipientEmail: result?.recipientEmail || 'mdc476728@gmail.com',
          message:
            result?.message ||
            apiRes.message ||
            'Resend email delivery could not be completed.',
          details: result?.details || result?.error || apiRes.message,
        });
      }
    } finally {
      setIsSubmitting(false);
      checkEmailStatus();
    }
  };

  const handleRetryEmail = async () => {
    if (!submissionStatus?.referenceId || isRetrying) return;
    setIsRetrying(true);
    try {
      const apiRes = await postJsonSafely<{
        success?: boolean;
        emailSent?: boolean;
        recipientEmail?: string;
        message?: string;
        error?: string;
        details?: string;
      }>('/api/retry-email', {
        referenceId: submissionStatus.referenceId,
        enquiry: formData,
      });

      const result = apiRes.data;

      if (apiRes.ok && result?.success && result?.emailSent) {
        setSubmissionStatus({
          success: true,
          emailSent: true,
          referenceId: submissionStatus.referenceId,
          recipientEmail: result.recipientEmail || 'mdc476728@gmail.com',
          message:
            'Your enquiry has been successfully delivered and an automated notification email was dispatched to official Gmail.',
        });
      } else if (result?.error === 'RESEND_API_KEY_NOT_CONFIGURED') {
        setSubmissionStatus((prev) => ({
          ...prev!,
          success: false,
          emailSent: false,
          error: 'RESEND_API_KEY_NOT_CONFIGURED',
          message:
            'Enquiry is safely stored in database. However, RESEND_API_KEY is not yet configured in server environment (.env). Email notification could not be delivered to your Gmail inbox.',
          details: result.details,
        }));
      } else {
        setSubmissionStatus((prev) => ({
          ...prev!,
          success: false,
          emailSent: false,
          error: result?.error || apiRes.error || 'EMAIL_DELIVERY_FAILED',
          message:
            result?.message ||
            apiRes.message ||
            'Resend email delivery could not be completed.',
          details: result?.details || result?.error || apiRes.message,
        }));
      }
    } finally {
      setIsRetrying(false);
      checkEmailStatus();
    }
  };

  const handleTestEmail = async () => {
    setIsTestingEmail(true);
    setTestEmailResult(null);
    try {
      const apiRes = await postJsonSafely<{
        success?: boolean;
        message?: string;
        error?: string;
      }>('/api/test-email');
      const data = apiRes.data;
      if (apiRes.ok && data?.success) {
        setTestEmailResult({
          success: true,
          message: data.message || 'Test email dispatched successfully! Check mdc476728@gmail.com inbox.',
        });
      } else {
        setTestEmailResult({
          success: false,
          message: data?.message || data?.error || apiRes.message || 'Failed to dispatch test email.',
        });
      }
    } finally {
      setIsTestingEmail(false);
      checkEmailStatus();
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      businessName: '',
      phoneNumber: '',
      whatsAppNumber: '',
      emailAddress: '',
      businessLocation: '',
      websiteType: 'Business Website',
      hasExistingWebsite: 'No',
      existingWebsiteUrl: '',
      requiredFeatures: ['Contact Form', 'WhatsApp Integration', 'Mobile Responsive Design'],
      projectBudget: '₹10,000–₹20,000',
      additionalRequirements: '',
    });
    setSubmissionStatus(null);
  };

  // Compile full pre-filled message for WhatsApp fallback
  const compiledWhatsAppText = `Hello DIGI TECH SOLUTION!
I have submitted a project enquiry:
- Name: ${formData.fullName || 'Client'}
- Business: ${formData.businessName || 'Business'}
- Mobile: ${formData.phoneNumber || 'N/A'}
- WhatsApp: ${formData.whatsAppNumber || formData.phoneNumber || 'N/A'}
- Email: ${formData.emailAddress || 'N/A'}
- Location: ${formData.businessLocation || 'Bihar, India'}
- Website Type: ${formData.websiteType}
- Existing Website: ${formData.hasExistingWebsite} ${
    formData.existingWebsiteUrl ? `(${formData.existingWebsiteUrl})` : ''
  }
- Budget: ${formData.projectBudget}
- Features: ${formData.requiredFeatures.join(', ')}
${formData.additionalRequirements ? `- Notes: ${formData.additionalRequirements}` : ''}`;

  const directWhatsAppUrl = `https://wa.me/91${AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    compiledWhatsAppText
  )}`;

  return (
    <section id="contact" className="py-20 lg:py-32 relative bg-[#080B12]">
      {/* Background illumination */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#3185FF]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D6B46A]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16 lg:mb-20">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#D6B46A]">
            <span>Get In Touch</span>
            <span className="text-slate-600">·</span>
            <span className="text-[#B7C0CE]">Free Project Consultation</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight text-white tracking-tight">
            LET'S DISCUSS <span className="gold-gradient-text">YOUR PROJECT</span>
          </h2>

          <p className="text-base text-[#B7C0CE] leading-relaxed">
            Tell us about your business and website requirements. Our team will contact you shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Agency Contact Details Cards */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-3">
              <h3 className="font-display font-bold text-2xl text-white">
                Ready to elevate your online business?
              </h3>
              <p className="text-sm text-[#B7C0CE] leading-relaxed">
                Whether you need a specialized hospital portal, digital restaurant menu,
                matrimonial platform, or custom business website, we are here to assist.
              </p>
            </div>

            {/* Contact Details List */}
            <div className="space-y-4 pt-2">
              {/* WhatsApp Card */}
              <a
                href={`https://wa.me/91${AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                  'Hello DIGI TECH SOLUTION! I would like to enquire about website development.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 rounded-xl bg-[#0E1626] border border-slate-800 hover:border-[#25D366]/50 transition-all duration-200 group"
              >
                <div className="p-3 rounded-lg bg-[#25D366]/10 text-[#25D366] shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    WhatsApp Chat (Instant)
                  </div>
                  <div className="text-base font-semibold text-white group-hover:text-[#25D366] transition-colors">
                    +91 {AGENCY_CONFIG.whatsappNumber}
                  </div>
                  <div className="text-xs text-slate-500">
                    Direct chat with our agency founders
                  </div>
                </div>
              </a>

              {/* Phone Card */}
              <a
                href={`tel:${AGENCY_CONFIG.contactNumber}`}
                className="flex items-start gap-4 p-4 rounded-xl bg-[#0E1626] border border-slate-800 hover:border-slate-700 transition-all duration-200 group"
              >
                <div className="p-3 rounded-lg bg-[#3185FF]/10 text-[#3185FF] shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Official Contact Number
                  </div>
                  <div className="text-base font-semibold text-white group-hover:text-[#3185FF] transition-colors">
                    {AGENCY_CONFIG.contactNumber}
                  </div>
                  <div className="text-xs text-slate-500">Mon–Sat: 9:00 AM – 8:00 PM IST</div>
                </div>
              </a>

              {/* Email Card */}
              <a
                href={`mailto:${AGENCY_CONFIG.emailAddress}`}
                className="flex items-start gap-4 p-4 rounded-xl bg-[#0E1626] border border-slate-800 hover:border-slate-700 transition-all duration-200 group"
              >
                <div className="p-3 rounded-lg bg-[#D6B46A]/10 text-[#D6B46A] shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Official Recipient Gmail
                  </div>
                  <div className="text-base font-semibold text-white group-hover:text-[#D6B46A] transition-colors break-all font-mono">
                    {AGENCY_CONFIG.emailAddress}
                  </div>
                  <div className="text-xs text-slate-500">
                    Subject: NEW CLIENT ENQUIRY – DIGI TECH SOLUTION
                  </div>
                </div>
              </a>

              {/* Location Card */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-[#0E1626] border border-slate-800">
                <div className="p-3 rounded-lg bg-slate-800 text-slate-300 shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Business Location
                  </div>
                  <div className="text-base font-semibold text-white">
                    {AGENCY_CONFIG.businessLocation}
                  </div>
                  <div className="text-xs text-slate-500">
                    Serving Bihar & modern clients across India
                  </div>
                </div>
              </div>
            </div>

            {/* Resend Integration Diagnostics & Test Box */}
            <div className="p-4 rounded-xl bg-[#101827] border border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-slate-200">
                  <Settings className="w-4 h-4 text-[#D6B46A]" />
                  <span>Resend Transactional Email</span>
                </div>
                {serverEmailStatus && (
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium ${
                      serverEmailStatus.hasApiKey
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        serverEmailStatus.hasApiKey ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                    <span>{serverEmailStatus.hasApiKey ? 'Key Active' : 'Key Missing'}</span>
                  </span>
                )}
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed">
                Sends automated notifications to{' '}
                <strong className="text-white">mdc476728@gmail.com</strong> when enquiries are
                submitted.
              </div>

              {/* One-Click Test Email Action */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleTestEmail}
                  disabled={isTestingEmail}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[11px] font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer border border-slate-700 disabled:opacity-50"
                >
                  {isTestingEmail ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Test Email via Resend...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#D6B46A]" />
                      <span>Test Email to mdc476728@gmail.com</span>
                    </>
                  )}
                </button>

                {testEmailResult && (
                  <div
                    className={`mt-2 p-2.5 rounded-lg text-[11px] border leading-relaxed ${
                      testEmailResult.success
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    {testEmailResult.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Full Professional Project Requirement Form */}
          <div className="lg:col-span-8">
            <div className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-[#0E1626] border border-slate-800 shadow-2xl relative">
              {submissionStatus ? (
                /* Submission Result States */
                <div className="space-y-6 py-6 text-center animate-in fade-in duration-300">
                  {submissionStatus.emailSent ? (
                    /* CASE 1: REAL CONFIRMED EMAIL DELIVERY */
                    <>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>

                      <div className="space-y-2 max-w-lg mx-auto">
                        <h4 className="font-display font-bold text-2xl text-white">
                          Enquiry & Email Notification Delivered!
                        </h4>
                        <p className="text-sm text-[#B7C0CE] leading-relaxed">
                          Your project enquiry was received and a real-time notification email has
                          been dispatched via Resend to{' '}
                          <strong className="text-[#D6B46A]">
                            {submissionStatus.recipientEmail}
                          </strong>
                          .
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#101827] border border-slate-800 text-xs font-mono text-slate-400 max-w-sm mx-auto">
                        Reference ID:{' '}
                        <span className="text-[#D6B46A] font-bold">
                          {submissionStatus.referenceId}
                        </span>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                          href={directWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba5a] transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Chat with Us on WhatsApp Now</span>
                        </a>

                        <button
                          onClick={resetForm}
                          className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          Submit Another Enquiry
                        </button>
                      </div>
                    </>
                  ) : submissionStatus.error === 'RESEND_API_KEY_NOT_CONFIGURED' ? (
                    /* CASE 2: ENQUIRY RECORDED, BUT RESEND_API_KEY IS AWAITING CONFIGURATION */
                    <>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border bg-amber-500/10 border-amber-500/30 text-amber-400">
                        <ShieldAlert className="w-8 h-8" />
                      </div>

                      <div className="space-y-2 max-w-lg mx-auto">
                        <h4 className="font-display font-bold text-2xl text-white">
                          Enquiry Stored · Email Setup Required
                        </h4>
                        <p className="text-sm text-[#B7C0CE] leading-relaxed">
                          Your enquiry has been saved permanently in the agency database.
                          However, automated Gmail delivery requires your{' '}
                          <strong className="text-amber-300">RESEND_API_KEY</strong> to be added to
                          the server environment (.env).
                        </p>
                      </div>

                      {/* Technical Instructions Box */}
                      <div className="p-4 rounded-xl bg-[#101827] border border-amber-500/30 text-xs text-left max-w-lg mx-auto space-y-2 text-slate-300">
                        <div className="font-semibold text-amber-300 flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          <span>Required Environment Variable in .env</span>
                        </div>
                        <div className="font-mono text-[11px] bg-[#080B12] p-2.5 rounded border border-slate-800 text-[#D6B46A]">
                          RESEND_API_KEY="re_your_api_key_here"<br />
                          OFFICIAL_NOTIFICATION_EMAIL="{submissionStatus.recipientEmail}"
                        </div>
                        <div className="text-[11px] text-slate-400">
                          1. Create a free key at <strong className="text-white">resend.com</strong>.<br />
                          2. Add it to <code className="text-[#D6B46A]">.env</code>.<br />
                          3. Click "Retry Email Dispatch" below.
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#101827] border border-slate-800 text-xs font-mono text-slate-400 max-w-sm mx-auto">
                        Reference ID:{' '}
                        <span className="text-[#D6B46A] font-bold">
                          {submissionStatus.referenceId}
                        </span>
                      </div>

                      {/* Actions with WhatsApp fallback and Retry */}
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                          href={directWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba5a] transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Send Details on WhatsApp (Instant)</span>
                        </a>

                        <button
                          onClick={handleRetryEmail}
                          disabled={isRetrying}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold text-[#080B12] bg-[#D6B46A] hover:bg-[#F0DCAB] transition-colors cursor-pointer disabled:opacity-60"
                        >
                          {isRetrying ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                          <span>{isRetrying ? 'Retrying Dispatch...' : 'Retry Email Dispatch'}</span>
                        </button>

                        <button
                          onClick={() => setSubmissionStatus(null)}
                          className="w-full sm:w-auto px-4 py-3.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    /* CASE 3: DELIVERY FAILURE / ERROR */
                    <>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border bg-rose-500/10 border-rose-500/30 text-rose-400">
                        <AlertCircle className="w-8 h-8" />
                      </div>

                      <div className="space-y-2 max-w-lg mx-auto">
                        <h4 className="font-display font-bold text-2xl text-white">
                          Email Dispatch Notice
                        </h4>
                        <p className="text-sm text-[#B7C0CE] leading-relaxed">
                          {submissionStatus.message}
                        </p>
                      </div>

                      {submissionStatus.details && (
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300 max-w-lg mx-auto text-left break-all">
                          {submissionStatus.details}
                        </div>
                      )}

                      <div className="p-3 rounded-xl bg-[#101827] border border-slate-800 text-xs font-mono text-slate-400 max-w-sm mx-auto">
                        Reference ID:{' '}
                        <span className="text-[#D6B46A] font-bold">
                          {submissionStatus.referenceId}
                        </span>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                          href={directWhatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba5a] transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Send via WhatsApp Alternative</span>
                        </a>

                        <button
                          onClick={handleRetryEmail}
                          disabled={isRetrying}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold text-[#080B12] bg-[#D6B46A] hover:bg-[#F0DCAB] transition-colors cursor-pointer disabled:opacity-60"
                        >
                          {isRetrying ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                          <span>{isRetrying ? 'Retrying Dispatch...' : 'Retry Email Dispatch'}</span>
                        </button>

                        <button
                          onClick={() => setSubmissionStatus(null)}
                          className="w-full sm:w-auto px-4 py-3.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          Edit Details
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Active Form */
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Invisible Honeypot to catch spambots */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="botHoneypot"
                      value={botHoneypot}
                      onChange={(e) => setBotHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Top Intro */}
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                      LET'S DISCUSS YOUR PROJECT
                    </h3>
                    <p className="text-xs sm:text-sm text-[#B7C0CE] mt-1">
                      Tell us about your business and website requirements. Our team will contact
                      you shortly.
                    </p>
                  </div>

                  {/* Row 1: Full Name & Business Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* 1. Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Full Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full px-4 py-2.5 rounded-xl bg-[#101827] border text-sm text-white placeholder-slate-500 focus:outline-hidden transition-colors ${
                          errors.fullName
                            ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                            : 'border-slate-800 focus:border-[#D6B46A]'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    {/* 2. Business / Company Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Business / Company Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="e.g. Apex Hospital / City Restaurant"
                        className={`w-full px-4 py-2.5 rounded-xl bg-[#101827] border text-sm text-white placeholder-slate-500 focus:outline-hidden transition-colors ${
                          errors.businessName
                            ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                            : 'border-slate-800 focus:border-[#D6B46A]'
                        }`}
                      />
                      {errors.businessName && (
                        <p className="text-[11px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.businessName}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Mobile Number & WhatsApp Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* 3. Mobile Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Mobile Number <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="e.g. 7319785754"
                        className={`w-full px-4 py-2.5 rounded-xl bg-[#101827] border text-sm text-white placeholder-slate-500 focus:outline-hidden transition-colors ${
                          errors.phoneNumber
                            ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                            : 'border-slate-800 focus:border-[#D6B46A]'
                        }`}
                      />
                      {errors.phoneNumber && (
                        <p className="text-[11px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.phoneNumber}</span>
                        </p>
                      )}
                    </div>

                    {/* 4. WhatsApp Number (Optional) */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        WhatsApp Number <span className="text-slate-500 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        name="whatsAppNumber"
                        value={formData.whatsAppNumber}
                        onChange={handleInputChange}
                        placeholder="Leave blank if same as mobile"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#101827] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#D6B46A]"
                      />
                    </div>
                  </div>

                  {/* Row 3: Email Address & Business Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* 5. Email Address */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Email Address <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleInputChange}
                        placeholder="e.g. client@example.com"
                        className={`w-full px-4 py-2.5 rounded-xl bg-[#101827] border text-sm text-white placeholder-slate-500 focus:outline-hidden transition-colors ${
                          errors.emailAddress
                            ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                            : 'border-slate-800 focus:border-[#D6B46A]'
                        }`}
                      />
                      {errors.emailAddress && (
                        <p className="text-[11px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.emailAddress}</span>
                        </p>
                      )}
                    </div>

                    {/* 6. Business Location */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Business Location <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="businessLocation"
                        value={formData.businessLocation}
                        onChange={handleInputChange}
                        placeholder="e.g. Darbhanga, Bihar / Patna"
                        className={`w-full px-4 py-2.5 rounded-xl bg-[#101827] border text-sm text-white placeholder-slate-500 focus:outline-hidden transition-colors ${
                          errors.businessLocation
                            ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                            : 'border-slate-800 focus:border-[#D6B46A]'
                        }`}
                      />
                      {errors.businessLocation && (
                        <p className="text-[11px] text-rose-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.businessLocation}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Website Type & Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* 7. Website Type */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Website Type <span className="text-rose-400">*</span>
                      </label>
                      <select
                        name="websiteType"
                        value={formData.websiteType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#101827] border border-slate-800 text-sm text-white focus:outline-hidden focus:border-[#D6B46A]"
                      >
                        {WEBSITE_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 11. Project Budget */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">
                        Project Budget <span className="text-rose-400">*</span>
                      </label>
                      <select
                        name="projectBudget"
                        value={formData.projectBudget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#101827] border border-slate-800 text-sm text-white focus:outline-hidden focus:border-[#D6B46A]"
                      >
                        {BUDGET_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 5: 8. Existing Website Question & 9. Existing URL */}
                  <div className="p-4 rounded-xl bg-[#101827] border border-slate-800/90 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <label className="text-xs font-semibold text-slate-300">
                        8. Do you already have a website? <span className="text-rose-400">*</span>
                      </label>
                      <div className="inline-flex items-center gap-4">
                        <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="radio"
                            name="hasExistingWebsite"
                            value="No"
                            checked={formData.hasExistingWebsite === 'No'}
                            onChange={handleInputChange}
                            className="text-[#D6B46A] focus:ring-[#D6B46A]"
                          />
                          <span>No (New Website)</span>
                        </label>
                        <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="radio"
                            name="hasExistingWebsite"
                            value="Yes"
                            checked={formData.hasExistingWebsite === 'Yes'}
                            onChange={handleInputChange}
                            className="text-[#D6B46A] focus:ring-[#D6B46A]"
                          />
                          <span>Yes (Redesign / Upgrade)</span>
                        </label>
                      </div>
                    </div>

                    {/* 9. Existing Website URL (shown when Yes) */}
                    {formData.hasExistingWebsite === 'Yes' && (
                      <div className="pt-2 border-t border-slate-800 space-y-1.5 animate-in fade-in duration-200">
                        <label className="text-xs font-semibold text-slate-300 block">
                          Existing Website URL <span className="text-slate-500 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                          <input
                            type="url"
                            name="existingWebsiteUrl"
                            value={formData.existingWebsiteUrl}
                            onChange={handleInputChange}
                            placeholder="https://yourcurrentwebsite.com"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080B12] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#D6B46A]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 10. Required Features (Allow Multiple Selection) */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300 block">
                        10. Required Features <span className="text-slate-500 font-normal">(Select all that apply)</span>
                      </label>
                      <span className="text-[11px] text-[#D6B46A] font-mono">
                        {formData.requiredFeatures.length} selected
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {AVAILABLE_FEATURES.map((feature) => {
                        const isChecked = formData.requiredFeatures.includes(feature);
                        return (
                          <button
                            key={feature}
                            type="button"
                            onClick={() => handleFeatureToggle(feature)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all duration-150 cursor-pointer flex items-center justify-between gap-1.5 ${
                              isChecked
                                ? 'bg-[#D6B46A]/15 border-[#D6B46A] text-white font-medium shadow-sm'
                                : 'bg-[#101827] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                            }`}
                          >
                            <span className="truncate">{feature}</span>
                            <span
                              className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 text-[10px] ${
                                isChecked
                                  ? 'bg-[#D6B46A] text-[#080B12] font-bold'
                                  : 'border border-slate-600'
                              }`}
                            >
                              {isChecked ? '✓' : ''}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 12. Additional Project Requirements (Large Text Area) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      12. Additional Project Requirements & Details
                    </label>
                    <textarea
                      name="additionalRequirements"
                      rows={4}
                      value={formData.additionalRequirements}
                      onChange={handleInputChange}
                      placeholder="Describe your design preferences, specific pages needed (e.g. Doctor Profiles, Food Menu, Matrimonial Profiles), competitor references, or desired launch deadline..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#101827] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#D6B46A] leading-relaxed"
                    />
                  </div>

                  {/* 13. Submit Project Enquiry Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl text-xs font-bold uppercase tracking-wider text-[#080B12] bg-[#D6B46A] hover:bg-[#F0DCAB] transition-all duration-200 shadow-lg shadow-[#D6B46A]/25 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#080B12]" />
                          <span>Submitting & Dispatching Notification...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Project Enquiry</span>
                        </>
                      )}
                    </button>

                    <a
                      href={directWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-5 rounded-xl text-xs font-semibold text-[#25D366] bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-colors whitespace-nowrap"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>

                  <p className="text-[11px] text-slate-500 text-center pt-1">
                    Direct notification dispatched to <strong className="text-slate-400">mdc476728@gmail.com</strong>.
                    Strict confidentiality guaranteed.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
