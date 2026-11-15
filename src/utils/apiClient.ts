/**
 * Safe, browser-independent API client for DIGI TECH SOLUTION.
 * Validates Content-Type and HTTP status before parsing JSON so HTML fallbacks
 * or network errors never crash mobile or desktop browsers with SyntaxError.
 */

export interface ApiResponse<T = Record<string, unknown>> {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string;
  message?: string;
}

function resolveApiUrl(endpoint: string): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return new URL(endpoint, window.location.origin).toString();
  }
  return endpoint;
}

async function parseSafeResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  const rawText = await response.text();

  if (!contentType.includes('application/json')) {
    const isHtml =
      rawText.trimStart().toLowerCase().startsWith('<!doctype') ||
      rawText.trimStart().toLowerCase().startsWith('<html');

    return {
      ok: false,
      status: response.status,
      data: null,
      error: isHtml ? 'NON_JSON_HTML_RESPONSE' : 'INVALID_CONTENT_TYPE',
      message: isHtml
        ? 'The API endpoint returned an HTML page instead of JSON. Please try again or contact us directly on WhatsApp.'
        : 'Server returned an unexpected response format. Please try again or contact us on WhatsApp.',
    };
  }

  try {
    const parsed = JSON.parse(rawText) as T;
    return {
      ok: response.ok,
      status: response.status,
      data: parsed,
    };
  } catch {
    return {
      ok: false,
      status: response.status,
      data: null,
      error: 'INVALID_JSON_RESPONSE',
      message: 'Received malformed JSON from server. Please try again or contact us on WhatsApp.',
    };
  }
}

export async function getJsonSafely<T = Record<string, unknown>>(
  endpoint: string
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(resolveApiUrl(endpoint), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    return await parseSafeResponse<T>(response);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      status: 0,
      data: null,
      error: 'NETWORK_ERROR',
      message: `Network connection error: ${msg}`,
    };
  }
}

export async function postJsonSafely<T = Record<string, unknown>>(
  endpoint: string,
  payload?: unknown
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(resolveApiUrl(endpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: payload !== undefined ? JSON.stringify(payload) : undefined,
      cache: 'no-store',
    });
    return await parseSafeResponse<T>(response);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      status: 0,
      data: null,
      error: 'NETWORK_ERROR',
      message: `Network connection error: ${msg}`,
    };
  }
}
