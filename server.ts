import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  validateEnquiryPayload,
  validateQuotePayload,
  checkRateLimit,
  dispatchEnquiryEmail,
  getEmailStatus,
  sendTestEmail,
  ProjectEnquiryPayload,
} from './src/server/emailDispatcher';
import {
  saveEnquiryPermanently,
  updateEnquiryEmailStatus,
  getEnquiryByReferenceId,
  StoredEnquiry,
} from './src/server/enquiryStore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown-ip';
}

async function handleSubmission(
  req: Request,
  res: Response,
  mode: 'enquiry' | 'quotation'
): Promise<void> {
  const clientIp = getClientIp(req);

  if (!checkRateLimit(clientIp)) {
    res.status(429).json({
      success: false,
      emailSent: false,
      error: 'RATE_LIMIT_EXCEEDED',
      message:
        'Too many requests from this IP address. Please wait a few minutes before submitting again.',
    });
    return;
  }

  const rawData = req.body || {};

  // Honeypot check for spam bots
  if (rawData.botHoneypot && String(rawData.botHoneypot).trim().length > 0) {
    res.status(200).json({
      success: true,
      emailSent: true,
      referenceId: 'DTS-SPAM-PREVENTED',
      message: 'Enquiry received.',
    });
    return;
  }

  const validation =
    mode === 'quotation'
      ? validateQuotePayload(rawData)
      : validateEnquiryPayload(rawData);

  if (!validation.valid) {
    res.status(400).json({
      success: false,
      emailSent: false,
      error: 'VALIDATION_FAILED',
      message: 'Please fill in all required fields accurately.',
      fieldErrors: validation.errors,
    });
    return;
  }

  const referenceId =
    rawData.referenceId ||
    `${mode === 'quotation' ? 'DTS-QT' : 'DTS'}-${Date.now().toString(36).toUpperCase()}`;

  const payload: ProjectEnquiryPayload = {
    referenceId,
    requestType: mode,
    fullName: String(rawData.fullName).trim(),
    businessName: String(rawData.businessName || 'Not provided').trim(),
    phoneNumber: String(rawData.phoneNumber).trim(),
    whatsAppNumber: rawData.whatsAppNumber ? String(rawData.whatsAppNumber).trim() : undefined,
    emailAddress: String(rawData.emailAddress || 'Not provided').trim(),
    businessLocation: String(rawData.businessLocation || 'Not provided').trim(),
    websiteType: String(rawData.websiteType || 'Business Website Development').trim(),
    hasExistingWebsite: rawData.hasExistingWebsite === 'Yes' ? 'Yes' : 'No',
    existingWebsiteUrl: rawData.existingWebsiteUrl
      ? String(rawData.existingWebsiteUrl).trim()
      : undefined,
    requiredFeatures: Array.isArray(rawData.requiredFeatures) ? rawData.requiredFeatures : [],
    projectBudget: String(rawData.projectBudget || 'Need Consultation').trim(),
    additionalRequirements: String(
      rawData.additionalRequirements || rawData.projectRequirements || ''
    ).trim(),
    submittedAt: rawData.submittedAt || new Date().toISOString(),
  };

  // 1. Save permanently BEFORE attempting email dispatch (zero enquiry loss)
  saveEnquiryPermanently({
    ...payload,
    emailStatus: 'pending',
  });

  console.log(`[DIGI TECH SOLUTION] ${mode.toUpperCase()} Stored:`, {
    referenceId: payload.referenceId,
    name: payload.fullName,
    business: payload.businessName,
    mobile: payload.phoneNumber,
    email: payload.emailAddress,
    type: payload.websiteType,
    budget: payload.projectBudget,
    time: payload.submittedAt,
  });

  // 2. Dispatch email notification via Resend SDK
  const emailResult = await dispatchEnquiryEmail(payload);

  if (emailResult.delivered) {
    updateEnquiryEmailStatus(referenceId, {
      emailStatus: 'delivered',
      emailMessageId: emailResult.messageId,
    });
    console.log(
      `[DIGI TECH SOLUTION] ${mode} email delivered to ${emailResult.recipientEmail}. Message ID: ${emailResult.messageId}`
    );
    res.status(200).json({
      success: true,
      emailSent: true,
      provider: 'resend',
      messageId: emailResult.messageId,
      referenceId,
      recipientEmail: emailResult.recipientEmail,
      savedLocally: true,
      message:
        mode === 'quotation'
          ? 'Your quotation request has been successfully submitted. Our team will contact you shortly.'
          : `Your project enquiry has been submitted successfully! An automated email notification was delivered to ${emailResult.recipientEmail}.`,
    });
    return;
  }

  if (emailResult.error === 'RESEND_API_KEY_NOT_CONFIGURED') {
    updateEnquiryEmailStatus(referenceId, {
      emailStatus: 'key_missing',
      emailError: 'RESEND_API_KEY_NOT_CONFIGURED',
    });
    console.error(
      `[DIGI TECH SOLUTION] Email dispatch failed for ${referenceId}: RESEND_API_KEY is not configured in server environment.`
    );
    res.status(503).json({
      success: false,
      emailSent: false,
      error: 'RESEND_API_KEY_NOT_CONFIGURED',
      referenceId,
      recipientEmail: emailResult.recipientEmail,
      savedLocally: true,
      message:
        mode === 'quotation'
          ? 'Your request could not be processed right now. Please try again or contact us directly on WhatsApp.'
          : `Enquiry permanently saved in agency database (Ref: ${referenceId}). However, RESEND_API_KEY is not configured in server .env to dispatch email alerts to ${emailResult.recipientEmail}.`,
      details: emailResult.details,
    });
    return;
  }

  updateEnquiryEmailStatus(referenceId, {
    emailStatus: 'failed',
    emailError: emailResult.error,
  });
  console.error(
    `[DIGI TECH SOLUTION] Resend email delivery failed for ${referenceId}:`,
    emailResult.error,
    emailResult.details
  );
  res.status(502).json({
    success: false,
    emailSent: false,
    error: 'EMAIL_DELIVERY_FAILED',
    referenceId,
    recipientEmail: emailResult.recipientEmail,
    savedLocally: true,
    message:
      mode === 'quotation'
        ? 'Your request could not be processed right now. Please try again or contact us directly on WhatsApp.'
        : `Resend email delivery to ${emailResult.recipientEmail} failed: ${emailResult.error}`,
    details: emailResult.details || emailResult.error,
  });
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '1mb' }));

  // Ensure all /api responses are strictly JSON with CORS-safe headers for same-origin/mobile
  app.use('/api', (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

  // 1. Diagnostic Endpoint: Check Resend Configuration Status
  app.get('/api/email-status', (_req: Request, res: Response) => {
    res.status(200).json(getEmailStatus());
  });

  // 2. Dedicated Test Email Endpoint: Verify Resend connection
  app.post('/api/test-email', async (_req: Request, res: Response) => {
    try {
      const testResult = await sendTestEmail();
      if (testResult.success) {
        res.status(200).json({
          success: true,
          message: `Test email successfully dispatched to ${testResult.recipientEmail}! Check your inbox.`,
          messageId: testResult.messageId,
        });
      } else {
        console.error('[DIGI TECH SOLUTION] Test email failed:', testResult.error);
        res.status(400).json({
          success: false,
          error: testResult.error,
          recipientEmail: testResult.recipientEmail,
          message: `Failed to dispatch test email: ${testResult.error}`,
        });
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error('[DIGI TECH SOLUTION] Test email exception:', errMsg);
      res.status(500).json({ success: false, error: errMsg, message: errMsg });
    }
  });

  // 3. Safe Retry Endpoint: Re-attempt Resend email dispatch without duplicate database records
  app.post('/api/retry-email', async (req: Request, res: Response) => {
    const clientIp = getClientIp(req);
    if (!checkRateLimit(clientIp)) {
      res.status(429).json({
        success: false,
        emailSent: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please wait a moment before retrying.',
      });
      return;
    }

    try {
      const { referenceId, enquiry } = req.body || {};
      if (!referenceId) {
        res.status(400).json({
          success: false,
          emailSent: false,
          error: 'MISSING_REFERENCE_ID',
          message: 'Reference ID is required to retry.',
        });
        return;
      }

      let record: StoredEnquiry | null = getEnquiryByReferenceId(referenceId);
      if (!record && enquiry) {
        const fallbackRecord: StoredEnquiry = { ...enquiry, referenceId };
        saveEnquiryPermanently(fallbackRecord);
        record = fallbackRecord;
      }

      if (!record) {
        res.status(404).json({
          success: false,
          emailSent: false,
          error: 'NOT_FOUND',
          message: 'Enquiry record not found in database.',
        });
        return;
      }

      record.retryCount = (record.retryCount || 0) + 1;
      saveEnquiryPermanently(record);

      const emailResult = await dispatchEnquiryEmail(record);
      if (emailResult.delivered) {
        updateEnquiryEmailStatus(referenceId, {
          emailStatus: 'delivered',
          emailMessageId: emailResult.messageId,
        });
        res.status(200).json({
          success: true,
          emailSent: true,
          provider: 'resend',
          messageId: emailResult.messageId,
          referenceId,
          recipientEmail: emailResult.recipientEmail,
          message: `Email notification successfully delivered via Resend to ${emailResult.recipientEmail}!`,
        });
      } else if (emailResult.error === 'RESEND_API_KEY_NOT_CONFIGURED') {
        updateEnquiryEmailStatus(referenceId, {
          emailStatus: 'key_missing',
          emailError: 'RESEND_API_KEY_NOT_CONFIGURED',
        });
        res.status(503).json({
          success: false,
          emailSent: false,
          error: 'RESEND_API_KEY_NOT_CONFIGURED',
          referenceId,
          recipientEmail: emailResult.recipientEmail,
          message: `Enquiry is preserved in database (Ref: ${referenceId}). However, RESEND_API_KEY is not configured in server .env to dispatch email alerts.`,
          details: emailResult.details,
        });
      } else {
        updateEnquiryEmailStatus(referenceId, {
          emailStatus: 'failed',
          emailError: emailResult.error,
        });
        res.status(502).json({
          success: false,
          emailSent: false,
          error: 'EMAIL_DELIVERY_FAILED',
          referenceId,
          recipientEmail: emailResult.recipientEmail,
          message: `Resend email delivery failed: ${emailResult.error}`,
          details: emailResult.details,
        });
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error('[DIGI TECH SOLUTION] Retry email exception:', errMsg);
      res.status(500).json({ success: false, emailSent: false, error: errMsg, message: errMsg });
    }
  });

  // 4. Main Project Requirement Enquiry Submission Endpoint
  app.post('/api/contact', async (req: Request, res: Response) => {
    try {
      await handleSubmission(req, res, req.body?.requestType === 'quotation' ? 'quotation' : 'enquiry');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error('[DIGI TECH SOLUTION] /api/contact exception:', errMsg);
      res.status(500).json({
        success: false,
        emailSent: false,
        error: 'SERVER_ERROR',
        message: `Internal server error processing enquiry: ${errMsg}`,
      });
    }
  });

  // 5. Dedicated Website Quotation Request Endpoint
  app.post('/api/quote', async (req: Request, res: Response) => {
    try {
      await handleSubmission(req, res, 'quotation');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error('[DIGI TECH SOLUTION] /api/quote exception:', errMsg);
      res.status(500).json({
        success: false,
        emailSent: false,
        error: 'SERVER_ERROR',
        message:
          'Your request could not be processed right now. Please try again or contact us directly on WhatsApp.',
      });
    }
  });

  // Catch-all for unknown /api/* routes so HTML is NEVER returned for API requests
  app.use('/api', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      emailSent: false,
      error: 'API_ROUTE_NOT_FOUND',
      message: `API endpoint ${req.method} ${req.originalUrl} not found.`,
    });
  });

  // JSON parse / Express error handler for /api
  app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl.startsWith('/api')) {
      const msg = err instanceof Error ? err.message : 'Invalid request payload';
      console.error('[DIGI TECH SOLUTION] API Middleware Error:', msg);
      res.status(400).json({
        success: false,
        emailSent: false,
        error: 'BAD_REQUEST',
        message: msg,
      });
      return;
    }
    next(err);
  });

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DIGI TECH SOLUTION] Server running on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[DIGI TECH SOLUTION] Fatal server startup error:', err);
  process.exit(1);
});
