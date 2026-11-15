/**
 * Server-Side Email Dispatcher for DIGI TECH SOLUTION
 * Powered by official Resend Node.js SDK.
 * Sends structured notifications to OFFICIAL_NOTIFICATION_EMAIL (mdc476728@gmail.com).
 */

import { Resend } from 'resend';

export interface ProjectEnquiryPayload {
  referenceId: string;
  requestType?: 'enquiry' | 'quotation';
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
  submittedAt: string;
  botHoneypot?: string;
}

export interface EmailDispatchResult {
  delivered: boolean;
  provider: 'resend' | 'none';
  messageId?: string;
  error?: string;
  details?: string;
  recipientEmail: string;
}

// In-memory rate limiting map: ip -> timestamps[]
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(clientIp: string, maxRequests = 8, windowMinutes = 10): boolean {
  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  const timestamps = rateLimitMap.get(clientIp) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxRequests) {
    return false;
  }

  validTimestamps.push(now);
  rateLimitMap.set(clientIp, validTimestamps);
  return true;
}

export function validateEnquiryPayload(data: Partial<ProjectEnquiryPayload>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Full Name is required (minimum 2 characters).';
  }

  if (!data.businessName || data.businessName.trim().length < 2) {
    errors.businessName = 'Business / Company Name is required.';
  }

  const cleanPhone = (data.phoneNumber || '').replace(/[^0-9]/g, '');
  if (!cleanPhone || cleanPhone.length < 10) {
    errors.phoneNumber = 'A valid 10-digit mobile number is required.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.emailAddress || !emailRegex.test(data.emailAddress.trim())) {
    errors.emailAddress = 'A valid email address is required.';
  }

  if (!data.businessLocation || data.businessLocation.trim().length < 2) {
    errors.businessLocation = 'Business location is required.';
  }

  if (!data.websiteType || data.websiteType.trim().length === 0) {
    errors.websiteType = 'Website type selection is required.';
  }

  if (!data.hasExistingWebsite || !['Yes', 'No'].includes(data.hasExistingWebsite)) {
    errors.hasExistingWebsite = 'Please specify if you already have a website (Yes/No).';
  }

  if (!data.projectBudget || data.projectBudget.trim().length === 0) {
    errors.projectBudget = 'Please select a project budget range.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateQuotePayload(data: Partial<ProjectEnquiryPayload>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Full Name is required (minimum 2 characters).';
  }

  const cleanPhone = (data.phoneNumber || '').replace(/[^0-9]/g, '');
  if (!cleanPhone || cleanPhone.length < 10) {
    errors.phoneNumber = 'A valid 10-digit mobile / WhatsApp number is required.';
  }

  if (data.emailAddress && data.emailAddress.trim() !== '' && data.emailAddress.trim() !== 'Not provided') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.emailAddress.trim())) {
      errors.emailAddress = 'Please provide a valid email address.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function getRecipientEmail(): string {
  return (
    process.env.OFFICIAL_NOTIFICATION_EMAIL ||
    process.env.NOTIFICATION_EMAIL ||
    'mdc476728@gmail.com'
  );
}

export function getEmailStatus(): {
  configured: boolean;
  provider: 'resend' | 'none';
  targetEmail: string;
  hasApiKey: boolean;
  senderAddress: string;
} {
  const targetEmail = getRecipientEmail();
  const hasApiKey = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim().length > 0);
  const senderAddress = process.env.RESEND_FROM_EMAIL || 'DIGI TECH SOLUTION <onboarding@resend.dev>';
  return {
    configured: hasApiKey,
    provider: hasApiKey ? 'resend' : 'none',
    targetEmail,
    hasApiKey,
    senderAddress,
  };
}

function getEmailSubject(enquiry: ProjectEnquiryPayload): string {
  return enquiry.requestType === 'quotation'
    ? 'NEW WEBSITE QUOTATION REQUEST – DIGI TECH SOLUTION'
    : 'NEW CLIENT ENQUIRY – DIGI TECH SOLUTION';
}

function generateEmailHtml(enquiry: ProjectEnquiryPayload): string {
  const emailSubject = getEmailSubject(enquiry);
  const formattedDate = new Date(enquiry.submittedAt).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const featuresList =
    enquiry.requiredFeatures && enquiry.requiredFeatures.length > 0
      ? enquiry.requiredFeatures.join(', ')
      : 'Standard Website Setup';

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>${emailSubject}</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080B12; color: #FFFFFF; margin: 0; padding: 20px; }
      .container { max-width: 600px; margin: 0 auto; background-color: #0E1626; border: 1px solid #1E293B; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
      .header { background: linear-gradient(135deg, #101827 0%, #151F32 100%); padding: 24px; border-bottom: 2px solid #D6B46A; }
      .header h1 { margin: 0; font-size: 22px; color: #FFFFFF; letter-spacing: -0.5px; }
      .header p { margin: 6px 0 0 0; font-size: 13px; color: #D6B46A; font-weight: 500; }
      .content { padding: 24px; color: #E2E8F0; }
      .badge { display: inline-block; padding: 5px 12px; background-color: #1E293B; border: 1px solid #D6B46A; border-radius: 6px; font-size: 12px; color: #D6B46A; font-weight: bold; margin-bottom: 18px; font-family: monospace; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      th, td { padding: 11px 12px; text-align: left; font-size: 13px; border-bottom: 1px solid #1E293B; }
      th { color: #94A3B8; width: 36%; font-weight: 600; }
      td { color: #F8FAFC; }
      .highlight { color: #3185FF; font-weight: 600; }
      .gold { color: #D6B46A; font-weight: 600; }
      .notes-box { background-color: #101827; border: 1px solid #1E293B; border-radius: 8px; padding: 14px; margin-top: 10px; font-size: 13px; line-height: 1.6; color: #CBD5E1; }
      .footer { background-color: #080B12; padding: 18px 24px; font-size: 12px; color: #64748B; text-align: center; border-top: 1px solid #1E293B; }
      .btn { display: inline-block; padding: 12px 22px; background-color: #25D366; color: #080B12; font-weight: bold; text-decoration: none; border-radius: 8px; font-size: 13px; margin-top: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>DIGI TECH SOLUTION</h1>
        <p>Your Digital Growth Partner · ${
          enquiry.requestType === 'quotation'
            ? 'New Website Quotation Request'
            : 'New Client Project Enquiry'
        }</p>
      </div>
      <div class="content">
        <div class="badge">Reference ID: ${enquiry.referenceId}</div>
        <p style="margin: 0 0 16px 0; font-size: 14px; color: #CBD5E1;">A client has submitted a detailed project requirement inquiry on your portfolio website:</p>
        
        <table>
          <tr>
            <th>Client Name</th>
            <td class="gold"><strong>${enquiry.fullName}</strong></td>
          </tr>
          <tr>
            <th>Business Name</th>
            <td><strong>${enquiry.businessName}</strong></td>
          </tr>
          <tr>
            <th>Business Category</th>
            <td class="highlight"><strong>${enquiry.websiteType}</strong></td>
          </tr>
          <tr>
            <th>Phone Number</th>
            <td><a href="tel:${enquiry.phoneNumber}" style="color: #3185FF; text-decoration: none; font-weight: bold;">${enquiry.phoneNumber}</a></td>
          </tr>
          <tr>
            <th>WhatsApp Number</th>
            <td>${
              enquiry.whatsAppNumber
                ? `<a href="https://wa.me/91${enquiry.whatsAppNumber.replace(/[^0-9]/g, '')}" style="color: #25D366; text-decoration: none; font-weight: bold;">${enquiry.whatsAppNumber}</a>`
                : 'Same as Mobile / Not Provided'
            }</td>
          </tr>
          <tr>
            <th>Email Address</th>
            <td><a href="mailto:${enquiry.emailAddress}" style="color: #3185FF; text-decoration: none;">${enquiry.emailAddress}</a></td>
          </tr>
          <tr>
            <th>Business Location</th>
            <td>${enquiry.businessLocation}</td>
          </tr>
          <tr>
            <th>Required Service</th>
            <td class="highlight">${enquiry.websiteType}</td>
          </tr>
          <tr>
            <th>Required Features</th>
            <td>${featuresList}</td>
          </tr>
          <tr>
            <th>Existing Website Status</th>
            <td>${enquiry.hasExistingWebsite}${
              enquiry.existingWebsiteUrl
                ? ` — <a href="${enquiry.existingWebsiteUrl}" target="_blank" style="color: #D6B46A;">${enquiry.existingWebsiteUrl}</a>`
                : ''
            }</td>
          </tr>
          <tr>
            <th>Project Budget</th>
            <td class="gold"><strong>${enquiry.projectBudget}</strong></td>
          </tr>
          <tr>
            <th>Submission Date & Time</th>
            <td>${formattedDate}</td>
          </tr>
        </table>

        <div style="margin-top: 20px;">
          <strong style="color: #D6B46A; font-size: 13px; text-transform: uppercase;">Project Requirements / Client Brief:</strong>
          <div class="notes-box">
            ${
              enquiry.additionalRequirements
                ? enquiry.additionalRequirements.replace(/\n/g, '<br/>')
                : 'No additional notes provided.'
            }
          </div>
        </div>

        <div style="text-align: center;">
          <a class="btn" href="https://wa.me/91${(enquiry.whatsAppNumber || enquiry.phoneNumber).replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(enquiry.fullName)}!%20Thank%20you%20for%20contacting%20DIGI%20TECH%20SOLUTION%20regarding%20your%20${encodeURIComponent(enquiry.websiteType)}%20project.">Reply to Client on WhatsApp</a>
        </div>
      </div>
      <div class="footer">
        DIGI TECH SOLUTION · Darbhanga, Bihar, India · Recipient: <a href="mailto:${getRecipientEmail()}" style="color: #64748B;">${getRecipientEmail()}</a>
      </div>
    </div>
  </body>
  </html>
  `;
}

function generatePlainText(enquiry: ProjectEnquiryPayload): string {
  return `
${getEmailSubject(enquiry)}
==================================================
Reference ID: ${enquiry.referenceId}
Submission Date & Time: ${enquiry.submittedAt}

CLIENT DETAILS:
- Client Name: ${enquiry.fullName}
- Business Name: ${enquiry.businessName}
- Business Category: ${enquiry.websiteType}
- Phone Number: ${enquiry.phoneNumber}
- WhatsApp Number: ${enquiry.whatsAppNumber || 'Same as Mobile'}
- Email Address: ${enquiry.emailAddress}
- Business Location: ${enquiry.businessLocation}

PROJECT SPECIFICATIONS:
- Required Service: ${enquiry.websiteType}
- Required Features: ${enquiry.requiredFeatures?.join(', ') || 'None'}
- Existing Website Status: ${enquiry.hasExistingWebsite}
- Existing Website URL: ${enquiry.existingWebsiteUrl || 'None'}
- Project Budget: ${enquiry.projectBudget}

PROJECT REQUIREMENTS:
${enquiry.additionalRequirements || 'None provided'}
==================================================
`;
}

/**
 * Dispatches project enquiry email using official Resend Node.js SDK
 */
export async function dispatchEnquiryEmail(
  enquiry: ProjectEnquiryPayload
): Promise<EmailDispatchResult> {
  const recipientEmail = getRecipientEmail();
  const resendApiKey = process.env.RESEND_API_KEY?.trim();

  // If RESEND_API_KEY is not configured
  if (!resendApiKey) {
    return {
      delivered: false,
      provider: 'none',
      recipientEmail,
      error: 'RESEND_API_KEY_NOT_CONFIGURED',
      details:
        'RESEND_API_KEY environment variable is missing on the server. Please add your Resend API Key to .env to enable instant Gmail notifications.',
    };
  }

  const emailSubject = getEmailSubject(enquiry);
  const htmlContent = generateEmailHtml(enquiry);
  const textContent = generatePlainText(enquiry);
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || 'DIGI TECH SOLUTION <onboarding@resend.dev>';

  try {
    // Official Resend Node.js SDK instance
    const resend = new Resend(resendApiKey);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [recipientEmail],
      subject: emailSubject,
      html: htmlContent,
      text: textContent,
      ...(enquiry.emailAddress && enquiry.emailAddress.includes('@')
        ? { replyTo: enquiry.emailAddress }
        : {}),
    });

    if (error) {
      console.error('[DIGI TECH SOLUTION] Resend SDK error:', error);
      return {
        delivered: false,
        provider: 'resend',
        recipientEmail,
        error: error.message || error.name || 'Resend SDK returned an error',
        details: JSON.stringify(error),
      };
    }

    if (!data?.id) {
      console.error('[DIGI TECH SOLUTION] Resend SDK returned no message ID:', data);
      return {
        delivered: false,
        provider: 'resend',
        recipientEmail,
        error: 'Resend did not return a message ID',
      };
    }

    console.log(`[DIGI TECH SOLUTION] Email delivered successfully via Resend SDK. Message ID: ${data.id}`);
    return {
      delivered: true,
      provider: 'resend',
      recipientEmail,
      messageId: data.id,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[DIGI TECH SOLUTION] Exception calling Resend SDK:', errorMessage);
    return {
      delivered: false,
      provider: 'resend',
      recipientEmail,
      error: errorMessage,
    };
  }
}

/**
 * Sends a real test email to verify Resend connection using official Resend SDK
 */
export async function sendTestEmail(): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
  recipientEmail: string;
}> {
  const recipientEmail = getRecipientEmail();
  const resendApiKey = process.env.RESEND_API_KEY?.trim();

  if (!resendApiKey) {
    return {
      success: false,
      recipientEmail,
      error: 'RESEND_API_KEY is not configured in server environment (.env).',
    };
  }

  const fromEmail =
    process.env.RESEND_FROM_EMAIL || 'DIGI TECH SOLUTION <onboarding@resend.dev>';

  try {
    const resend = new Resend(resendApiKey);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [recipientEmail],
      subject: 'TEST EMAIL – DIGI TECH SOLUTION Backend Verification',
      html: `
      <div style="font-family: sans-serif; padding: 24px; background-color: #0E1626; color: #FFFFFF; border-radius: 10px; border: 1px solid #1E293B; max-width: 500px;">
        <h2 style="color: #D6B46A; margin-top: 0;">DIGI TECH SOLUTION</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #E2E8F0;">
          This is an official test email confirming that the <strong>Resend Node.js SDK Integration</strong> is configured and communicating with your Gmail inbox!
        </p>
        <p style="font-size: 13px; color: #94A3B8;">Recipient Inbox: <strong style="color: #3185FF;">${recipientEmail}</strong></p>
        <p style="font-size: 12px; color: #64748B;">Timestamp: ${new Date().toISOString()}</p>
      </div>
      `,
      text: `DIGI TECH SOLUTION - Test email sent to ${recipientEmail} via Resend SDK.`,
    });

    if (error) {
      return {
        success: false,
        recipientEmail,
        error: error.message || error.name || 'Resend SDK returned an error',
      };
    }

    return {
      success: true,
      recipientEmail,
      messageId: data?.id,
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      recipientEmail,
      error: errorMessage,
    };
  }
}
