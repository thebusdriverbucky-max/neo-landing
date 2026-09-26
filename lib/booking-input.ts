export type BookingInput = {
  name: string;
  phone: string;
  email: string | null;
  date: string | null;
  message: string | null;
};

export class BookingInputError extends Error {}

function optionalString(
  value: unknown,
  field: string,
  maxLength: number,
): string | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') {
    throw new BookingInputError(`${field} must be a string`);
  }

  const normalized = value.trim();
  if (!normalized) return null;
  if (normalized.length > maxLength) {
    throw new BookingInputError(`${field} is too long (max ${maxLength} characters)`);
  }
  return normalized;
}

function requiredString(
  value: unknown,
  field: string,
  maxLength: number,
): string {
  const normalized = optionalString(value, field, maxLength);
  if (!normalized) throw new BookingInputError(`${field} is required`);
  return normalized;
}

function isCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

export function parseBookingInput(value: unknown): BookingInput {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new BookingInputError('Request body must be a JSON object');
  }

  const body = value as Record<string, unknown>;
  const name = requiredString(body.name, 'Name', 20);
  const phone = requiredString(body.phone, 'Phone', 20);
  const email = optionalString(body.email, 'Email', 100)?.toLowerCase() || null;
  const date = optionalString(body.date, 'Date', 10);
  const message = optionalString(body.message, 'Message', 500);

  if (/[\r\n]/.test(name)) {
    throw new BookingInputError('Name format is invalid');
  }
  const phoneDigits = phone.replace(/\D/g, '');
  if (!/^[+0-9().\s-]+$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    throw new BookingInputError('Phone format is invalid');
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new BookingInputError('Email format is invalid');
  }
  if (date && !isCalendarDate(date)) {
    throw new BookingInputError('Date must be a valid calendar date in YYYY-MM-DD format');
  }

  return { name, phone, email, date, message };
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    switch (character) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case "'": return '&#39;';
      case '"': return '&quot;';
      default: return character;
    }
  });
}
