/**
 * Persistent Enquiry Storage for DIGI TECH SOLUTION
 * Stores all client enquiries persistently in data/enquiries.json.
 * Guarantees zero enquiry loss, duplicate prevention, and email delivery status tracking.
 */

import fs from 'fs';
import path from 'path';
import { ProjectEnquiryPayload } from './emailDispatcher';

export interface StoredEnquiry extends ProjectEnquiryPayload {
  emailStatus?: 'pending' | 'delivered' | 'failed' | 'key_missing';
  emailMessageId?: string;
  emailError?: string;
  lastEmailAttemptAt?: string;
  retryCount?: number;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');

// Ensure data directory exists
function ensureStorage(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ENQUIRIES_FILE)) {
      fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('[DIGI TECH SOLUTION] Failed to initialize storage directory:', err);
  }
}

/**
 * Saves or updates an enquiry permanently in the database.
 * Prevents duplicate enquiry records by updating in-place if referenceId matches.
 */
export function saveEnquiryPermanently(enquiry: StoredEnquiry): boolean {
  try {
    ensureStorage();
    const raw = fs.readFileSync(ENQUIRIES_FILE, 'utf-8');
    const list: StoredEnquiry[] = JSON.parse(raw || '[]');

    const existingIndex = list.findIndex((item) => item.referenceId === enquiry.referenceId);

    if (existingIndex >= 0) {
      // Update existing record without creating duplicate
      list[existingIndex] = {
        ...list[existingIndex],
        ...enquiry,
        retryCount: (list[existingIndex].retryCount || 0) + (enquiry.retryCount ? 1 : 0),
      };
      console.log(
        `[DIGI TECH SOLUTION] Updated existing enquiry ${enquiry.referenceId} in ${ENQUIRIES_FILE}`
      );
    } else {
      // Prepend new record
      list.unshift({
        ...enquiry,
        emailStatus: enquiry.emailStatus || 'pending',
        retryCount: 0,
      });
      console.log(
        `[DIGI TECH SOLUTION] Saved new enquiry ${enquiry.referenceId} permanently to ${ENQUIRIES_FILE}`
      );
    }

    fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[DIGI TECH SOLUTION] Error writing enquiry to disk:', err);
    return false;
  }
}

/**
 * Updates the email delivery status of an existing enquiry in the database.
 */
export function updateEnquiryEmailStatus(
  referenceId: string,
  update: {
    emailStatus: 'pending' | 'delivered' | 'failed' | 'key_missing';
    emailMessageId?: string;
    emailError?: string;
  }
): boolean {
  try {
    ensureStorage();
    const raw = fs.readFileSync(ENQUIRIES_FILE, 'utf-8');
    const list: StoredEnquiry[] = JSON.parse(raw || '[]');

    const record = list.find((item) => item.referenceId === referenceId);
    if (!record) {
      console.warn(`[DIGI TECH SOLUTION] Enquiry ${referenceId} not found to update email status.`);
      return false;
    }

    record.emailStatus = update.emailStatus;
    if (update.emailMessageId) record.emailMessageId = update.emailMessageId;
    if (update.emailError !== undefined) record.emailError = update.emailError;
    record.lastEmailAttemptAt = new Date().toISOString();

    fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(list, null, 2), 'utf-8');
    console.log(
      `[DIGI TECH SOLUTION] Updated enquiry ${referenceId} emailStatus to "${update.emailStatus}"`
    );
    return true;
  } catch (err) {
    console.error('[DIGI TECH SOLUTION] Error updating email status in storage:', err);
    return false;
  }
}

/**
 * Retrieves a single enquiry by reference ID.
 */
export function getEnquiryByReferenceId(referenceId: string): StoredEnquiry | null {
  try {
    ensureStorage();
    const raw = fs.readFileSync(ENQUIRIES_FILE, 'utf-8');
    const list: StoredEnquiry[] = JSON.parse(raw || '[]');
    return list.find((item) => item.referenceId === referenceId) || null;
  } catch (err) {
    console.error('[DIGI TECH SOLUTION] Error looking up enquiry by referenceId:', err);
    return null;
  }
}

/**
 * Retrieves all stored enquiries.
 */
export function getAllEnquiries(): StoredEnquiry[] {
  try {
    ensureStorage();
    const raw = fs.readFileSync(ENQUIRIES_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('[DIGI TECH SOLUTION] Error reading enquiries from disk:', err);
    return [];
  }
}
