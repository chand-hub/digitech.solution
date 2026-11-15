import React, { useState } from 'react';
import {
  X,
  Send,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { getWhatsAppEnquiryUrl } from '../config/agencyConfig';
import { postJsonSafely } from '../utils/apiClient';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedService?: string;
}

interface QuoteApiResponse {
  success: boolean;
  emailSent: boolean;
  referenceId?: string;
  recipientEmail?: string;
  message?: string;
  error?: string;
}

const BUDGET_RANGES = [
  'Below ₹10,000',
  '₹10,000–₹20,000',
  '₹20,000–₹50,000',
  'Above ₹50,000',
  'Need Consultation',
];

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  preSelectedService,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    business: '',
    websiteType: preSelectedService || 'Business Website Development',
    budget: 'Need Consultation',
    timeline: 'Within 2-3 weeks',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteResult, setQuoteResult] = useState<{
    status: 'idle' | 'success' | 'failed';
    referenceId: string;
    message: string;
    details?: string;
  }>({
    status: 'idle',
    referenceId: '',
    message: '',
  });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const submitQuoteToServer = async (refId: string) => {
    setIsSubmitting(true);
    setError('');

    const payload = {
      referenceId: refId,
      requestType: 'quotation',
      fullName: formData.name.trim(),
      businessName: formData.business.trim() || 'Not provided',
      phoneNumber: formData.phone.trim(),
      emailAddress: formData.email.trim() || 'Not provided',
      businessLocation: 'Online Quotation Request',
      websiteType: formData.websiteType,
      hasExistingWebsite: 'No',
      requiredFeatures: [`Timeline: ${formData.timeline}`],
      projectBudget: formData.budget,
      additionalRequirements:
        formData.notes.trim() || `Quick Quote Request (Timeline: ${formData.timeline})`,
      submittedAt: new Date().toISOString(),
    };

    const res = await postJsonSafely<QuoteApiResponse>('/api/quote', payload);
    setIsSubmitting(false);

    if (res.ok && res.data?.success && res.data?.emailSent === true) {
      setQuoteResult({
        status: 'success',
        referenceId: res.data.referenceId || refId,
        message:
          'Your quotation request has been successfully submitted. Our team will contact you shortly.',
      });
    } else {
      setQuoteResult({
        status: 'failed',
        referenceId: res.data?.referenceId || refId,
        message:
          'Your request could not be processed right now. Please try again or contact us directly on WhatsApp.',
        details: res.data?.message || res.message || res.error,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile / WhatsApp number.');
      return;
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Please enter a valid email address or leave it blank.');
      return;
    }

    const ref = quoteResult.referenceId || `DTS-QT-${Date.now().toString(36).toUpperCase()}`;

    // Save to localStorage audit log
    try {
      const saved = JSON.parse(localStorage.getItem('dts_quotes') || '[]');
      if (!saved.some((item: { referenceId?: string }) => item.referenceId === ref)) {
        saved.push({ ...formData, referenceId: ref, date: new Date().toISOString() });
        localStorage.setItem('dts_quotes', JSON.stringify(saved));
      }
    } catch {
      // Ignore storage quota issues
    }

    await submitQuoteToServer(ref);
  };

  const handleRetry = async () => {
    if (isSubmitting || !quoteResult.referenceId) return;
    setIsSubmitting(true);
    const res = await postJsonSafely<QuoteApiResponse>('/api/retry-email', {
      referenceId: quoteResult.referenceId,
    });
    setIsSubmitting(false);

    if (res.ok && res.data?.success && res.data?.emailSent === true) {
      setQuoteResult({
        status: 'success',
        referenceId: quoteResult.referenceId,
        message:
          'Your quotation request has been successfully submitted. Our team will contact you shortly.',
      });
    } else {
      setQuoteResult((prev) => ({
        ...prev,
        status: 'failed',
        message:
          'Your request could not be processed right now. Please try again or contact us directly on WhatsApp.',
        details: res.data?.message || res.message || res.error,
      }));
    }
  };

  const handleResetAndClose = () => {
    setQuoteResult({ status: 'idle', referenceId: '', message: '' });
    setError('');
    onClose();
  };

  const whatsappUrl = getWhatsAppEnquiryUrl({
    name: formData.name,
    business: formData.business,
    websiteType: `${formData.websiteType} (Budget: ${formData.budget}, Timeline: ${formData.timeline})`,
    requirements: formData.notes || 'Requesting a free estimate and discovery call.',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0E1626] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {quoteResult.status === 'success' ? (
          <div className="text-center py-6 space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-bold text-2xl text-white">
                Quotation Request Submitted
              </h3>
              <p className="text-sm text-[#B7C0CE] leading-relaxed">{quoteResult.message}</p>
              <p className="text-xs text-slate-400 pt-1">
                Reference ID:{' '}
                <span className="text-[#D6B46A] font-mono font-semibold">
                  {quoteResult.referenceId}
                </span>
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba5a] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Continue on WhatsApp for Instant Reply</span>
              </a>

              <button
                onClick={handleResetAndClose}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : quoteResult.status === 'failed' ? (
          <div className="text-center py-6 space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-bold text-2xl text-white">
                Unable to Send Email Notification
              </h3>
              <p className="text-sm text-[#B7C0CE] leading-relaxed">{quoteResult.message}</p>
              {quoteResult.referenceId && (
                <p className="text-xs text-slate-400 pt-1">
                  Reference ID:{' '}
                  <span className="text-[#D6B46A] font-mono font-semibold">
                    {quoteResult.referenceId}
                  </span>
                </p>
              )}
              {quoteResult.details && (
                <p className="text-[11px] font-mono text-rose-300/90 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5 text-left break-words">
                  {quoteResult.details}
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20ba5a] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Quote on WhatsApp Now</span>
              </a>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleRetry}
                  disabled={isSubmitting}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-[#080B12] bg-[#D6B46A] hover:bg-[#F0DCAB] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>{isSubmitting ? 'Retrying...' : 'Try Again'}</span>
                </button>

                <button
                  onClick={() => setQuoteResult({ status: 'idle', referenceId: '', message: '' })}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 transition-colors cursor-pointer"
                >
                  Edit Details
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D6B46A]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Estimate</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white">
                Get a Free Project Quote
              </h3>
              <p className="text-xs text-[#B7C0CE]">
                Tell us about your business and we'll prepare a custom quotation.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alok Verma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101827] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#D6B46A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 7319785754"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101827] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#D6B46A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. name@business.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101827] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#D6B46A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. City Health Clinic"
                    value={formData.business}
                    onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101827] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#D6B46A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Website Category
                  </label>
                  <select
                    value={formData.websiteType}
                    onChange={(e) => setFormData({ ...formData, websiteType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101827] border border-slate-800 text-sm text-white focus:outline-hidden focus:border-[#D6B46A]"
                  >
                    <option value="Business Website Development">
                      Business Website Development
                    </option>
                    <option value="Hospital & Clinic Websites">
                      Hospital & Clinic Websites
                    </option>
                    <option value="Restaurant Website Development">
                      Restaurant Website Development
                    </option>
                    <option value="Matrimonial Website Development">
                      Matrimonial Website Development
                    </option>
                    <option value="Landing Page Development">Landing Page Development</option>
                    <option value="Website Redesign">Website Redesign</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Estimated Budget
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#101827] border border-slate-800 text-sm text-white focus:outline-hidden focus:border-[#D6B46A]"
                  >
                    {BUDGET_RANGES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Desired Timeline
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {['Within 1 week', 'Within 2-3 weeks', 'Flexible'].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeline: time })}
                      className={`py-2 px-2 rounded-lg border text-center transition-colors cursor-pointer ${
                        formData.timeline === time
                          ? 'border-[#D6B46A] bg-[#D6B46A]/10 text-white font-semibold'
                          : 'border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Brief Requirements / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Key features you'd like to include..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#101827] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-[#D6B46A]"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-[#080B12] bg-[#D6B46A] hover:bg-[#F0DCAB] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#D6B46A]/20 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Sending Quote Request...' : 'Submit For Free Quote'}</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto py-3 px-4 rounded-xl text-xs font-semibold text-[#25D366] bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Quote on WhatsApp</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
